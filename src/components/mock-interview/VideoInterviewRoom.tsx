"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface VideoInterviewRoomProps {
  sessionId: string;
  onLeave: () => void;
  onRecordingStarted?: () => void;
  onRecordingStopped?: () => void;
}

export function VideoInterviewRoom({
  sessionId,
  onLeave,
  onRecordingStarted,
  onRecordingStopped,
}: VideoInterviewRoomProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Separate playback logic to ensure reliable starting
  useEffect(() => {
    const videoEl = videoRef.current;
    const stream = streamRef.current;

    const startPlayback = async () => {
      if (videoEl && stream && !isInitializing) {
        // 1. Assign stream if missing
        if (videoEl.srcObject !== stream) {
          videoEl.srcObject = stream;
        }

        // 2. Force muted to satisfy autoplay policies
        videoEl.muted = true;
        videoEl.playsInline = true;

        // 3. Explicit play call
        try {
          await videoEl.play();
        } catch (err) {
          // Silent catch for production unless critical
          console.error("Playback failed:", err);
        }
      }
    };

    // Run immediately if ready
    startPlayback();

    // Also listen for metadata load as backup because sometimes readyState is 0
    if (videoEl) {
      videoEl.addEventListener('loadedmetadata', startPlayback);
      return () => videoEl.removeEventListener('loadedmetadata', startPlayback);
    }
  }, [isInitializing]); // Re-run when initialization finishes

  const initStream = useCallback(async () => {
    setIsInitializing(true);
    setError(null);
    try {
      // 1. Get stream first
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;

      // 2. Ensure tracks are enabled
      stream.getVideoTracks().forEach((t) => (t.enabled = true));

    } catch (e) {
      console.error("Camera access error:", e);
      const msg = e instanceof Error ? e.message : "Failed to access camera/microphone";
      setError(msg);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    initStream();
    return () => {
      stopStream();
    };
  }, [initStream, stopStream]);

  if (error) {
    return (
      <Card className="w-full aspect-video flex items-center justify-center p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={initStream}>
            Retry Camera Access
          </Button>
        </div>
      </Card>
    );
  }

  if (isInitializing) {
    return (
      <Card className="w-full aspect-video flex items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Preparing interview room...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      <Card className="relative w-full aspect-video bg-black overflow-hidden">
        {/* Video container */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
          autoPlay
          muted
          playsInline
        />
      </Card>
    </div>
  );
}
