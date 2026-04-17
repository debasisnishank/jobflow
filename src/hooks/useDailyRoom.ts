import { useState, useEffect, useCallback, useRef } from "react";
import DailyIframe, { DailyCall, DailyEvent, DailyEventObjectRecordingStarted, DailyEventObjectRecordingStopped } from "@daily-co/daily-js";

interface UseDailyRoomProps {
  sessionId: string;
  onLeave?: () => void;
  onRecordingStarted?: () => void;
  onRecordingStopped?: () => void;
  onError?: (error: Error) => void;
}

export function useDailyRoom({
  sessionId,
  onLeave,
  onRecordingStarted,
  onRecordingStopped,
  onError,
}: UseDailyRoomProps) {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const callObjectRef = useRef<DailyCall | null>(null);
  const handlersRef = useRef<Array<{ event: string; handler: (...args: any[]) => void }>>([]);
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [roomInfo, setRoomInfo] = useState<{
    roomUrl: string;
    roomName: string;
    token: string;
  } | null>(null);

  useEffect(() => {
    callObjectRef.current = callObject;
  }, [callObject]);

  const detachHandlers = useCallback((daily: DailyCall) => {
    const anyDaily = daily as any;
    if (typeof anyDaily.off !== "function") {
      handlersRef.current = [];
      return;
    }
    for (const h of handlersRef.current) {
      try {
        anyDaily.off(h.event, h.handler);
      } catch {}
    }
    handlersRef.current = [];
  }, []);

  // Create room and get token
  const createRoom = useCallback(async () => {
    try {
      setError(null);

      const response = await fetch("/api/daily/create-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const data = await response.json();
      setRoomInfo(data);
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      onError?.(error);
      throw error;
    }
  }, [sessionId, onError]);

  // Join the room
  const joinRoom = useCallback(
    async (roomData: { roomUrl: string; token: string }) => {
      setIsJoining(true);
      try {
        if (!roomData) {
          throw new Error("Room data not available");
        }

        // If a call instance already exists (StrictMode/HMR/previous unclean unmount),
        // re-use it instead of creating a new one (Daily disallows duplicates).
        const existing = DailyIframe.getCallInstance?.();
        const daily = existing && !existing.isDestroyed?.() ? existing : DailyIframe.createCallObject();

        // Ensure we don't stack duplicate listeners across joins.
        detachHandlers(daily);

        // If the existing instance is still in a meeting, leave first (before wiring listeners)
        // so we don't accidentally trigger UI "onLeave" flows.
        try {
          const state = (daily as any).meetingState?.() as string | undefined;
          if (state === "joining-meeting" || state === "joined-meeting") {
            await daily.leave();
          }
        } catch {}

        callObjectRef.current = daily;
        setCallObject(daily);

        // Set up event listeners
        const onJoined = () => {
          setIsJoined(true);
          setIsJoining(false);
        };
        const onLeft = () => {
          setIsJoined(false);
          onLeave?.();
        };
        const onParticipantJoined = () => updateParticipants(daily);
        const onParticipantLeft = () => updateParticipants(daily);
        const onParticipantUpdated = () => updateParticipants(daily);
        const onTrackStarted = () => updateParticipants(daily);
        const onTrackStopped = () => updateParticipants(daily);
        const onStartedCamera = () => updateParticipants(daily);
        const onCameraError = (event: any) => {
          const msg =
            event?.error?.msg ||
            event?.errorMsg ||
            event?.error?.type ||
            "Camera/mic permission error";
          setError(String(msg));
          onError?.(new Error(String(msg)));
          setIsJoining(false);
        };
        const onRecStarted = (_event: DailyEventObjectRecordingStarted) => {
          setIsRecording(true);
          onRecordingStarted?.();
        };
        const onRecStopped = (_event: DailyEventObjectRecordingStopped) => {
          setIsRecording(false);
          onRecordingStopped?.();
        };
        const onDailyError = (event: any) => {
          const msg = event?.errorMsg || event?.error?.message || "Daily call error";
          setError(msg);
          onError?.(new Error(msg));
          setIsJoining(false);
        };

        (daily as any)
          .on("joined-meeting", onJoined)
          .on("left-meeting", onLeft)
          .on("participant-joined", onParticipantJoined)
          .on("participant-updated", onParticipantUpdated)
          .on("participant-left", onParticipantLeft)
          .on("track-started", onTrackStarted)
          .on("track-stopped", onTrackStopped)
          .on("started-camera", onStartedCamera)
          .on("camera-error", onCameraError)
          .on("recording-started", onRecStarted)
          .on("recording-stopped", onRecStopped)
          .on("error", onDailyError);

        handlersRef.current = [
          { event: "joined-meeting", handler: onJoined },
          { event: "left-meeting", handler: onLeft },
          { event: "participant-joined", handler: onParticipantJoined },
          { event: "participant-updated", handler: onParticipantUpdated },
          { event: "participant-left", handler: onParticipantLeft },
          { event: "track-started", handler: onTrackStarted },
          { event: "track-stopped", handler: onTrackStopped },
          { event: "started-camera", handler: onStartedCamera },
          { event: "camera-error", handler: onCameraError },
          { event: "recording-started", handler: onRecStarted },
          { event: "recording-stopped", handler: onRecStopped },
          { event: "error", handler: onDailyError },
        ];

        // Join the call
        await daily.join({
          url: roomData.roomUrl,
          token: roomData.token,
        });

        // Treat join() resolve as joined to avoid UI hanging on events.
        setIsJoined(true);
        updateParticipants(daily);

        // Kick camera on explicitly (prompts for permissions if needed).
        try {
          await daily.startCamera();
        } catch {}
        setIsJoining(false);
      } catch (err) {
        const error = err as Error;
        console.error("Error joining room:", error);
        setError(error.message);
        setIsJoining(false);
        onError?.(error);
        throw error;
      }
    },
    [detachHandlers, onLeave, onRecordingStarted, onRecordingStopped, onError]
  );

  const updateParticipants = (daily: DailyCall) => {
    const participants = daily.participants();
    setParticipants(Object.values(participants));
  };

  // Leave the room
  const leaveRoom = useCallback(async () => {
    const active = callObjectRef.current;
    if (active) {
      try {
        detachHandlers(active);
        // Stop recording if still recording
        if (isRecording) {
          await active.stopRecording();
        }

        await active.leave();
        // Fire-and-forget destroy; also remove iframe synchronously to avoid StrictMode races.
        try {
          active.iframe?.()?.remove?.();
        } catch {}
        active.destroy().catch(() => {});
        callObjectRef.current = null;
        setCallObject(null);
        setIsJoined(false);

        // Delete the room
        if (roomInfo) {
          await fetch("/api/daily/delete-room", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomName: roomInfo.roomName }),
          });
        }
      } catch (err) {
        console.error("Error leaving room:", err);
      }
    }
  }, [detachHandlers, isRecording, roomInfo]);

  // Toggle camera
  const toggleCamera = useCallback(async () => {
    if (callObject) {
      const currentState = callObject.localVideo();
      await callObject.setLocalVideo(!currentState);
    }
  }, [callObject]);

  // Toggle microphone
  const toggleMicrophone = useCallback(async () => {
    if (callObject) {
      const currentState = callObject.localAudio();
      await callObject.setLocalAudio(!currentState);
    }
  }, [callObject]);

  // Get local audio state
  const isAudioEnabled = callObject?.localAudio() ?? true;
  const isVideoEnabled = callObject?.localVideo() ?? true;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (callObject) {
        callObject.destroy();
      }
    };
  }, [callObject]);

  return {
    callObject,
    isJoining,
    isJoined,
    isRecording,
    participants,
    error,
    roomInfo,
    isAudioEnabled,
    isVideoEnabled,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleCamera,
    toggleMicrophone,
  };
}

