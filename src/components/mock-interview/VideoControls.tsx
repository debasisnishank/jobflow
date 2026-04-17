"use client";

import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

interface VideoControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isRecording: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

export function VideoControls({
  isAudioEnabled,
  isVideoEnabled,
  isRecording,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
}: VideoControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {/* Microphone toggle */}
      <Button
        variant={isAudioEnabled ? "default" : "destructive"}
        size="lg"
        onClick={onToggleAudio}
        className="rounded-full h-14 w-14"
      >
        {isAudioEnabled ? (
          <Mic className="h-5 w-5" />
        ) : (
          <MicOff className="h-5 w-5" />
        )}
      </Button>

      {/* Camera toggle */}
      <Button
        variant={isVideoEnabled ? "default" : "destructive"}
        size="lg"
        onClick={onToggleVideo}
        className="rounded-full h-14 w-14"
      >
        {isVideoEnabled ? (
          <Video className="h-5 w-5" />
        ) : (
          <VideoOff className="h-5 w-5" />
        )}
      </Button>

      {/* End call button */}
      <Button
        variant="destructive"
        size="lg"
        onClick={onEndCall}
        className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700"
      >
        <PhoneOff className="h-5 w-5" />
      </Button>
    </div>
  );
}


