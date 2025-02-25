"use client";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";

export default function Controls() {
  const { connect, disconnect, readyState, pauseAssistant, resumeAssistant } = useVoice();

  return (
    <div className="w-full flex gap-2">
      {readyState === VoiceReadyState.OPEN ? (
        <button
          className="w-full py-3 rounded-md font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
          onClick={() => disconnect()}
        >
          End Session
        </button>
      ) : (
        <button
          className="w-full py-3 rounded-md font-medium bg-green-500 hover:bg-green-600 text-white transition-colors"
          onClick={() => connect()}
        >
          Start
        </button>
      )}
    </div>
  );
}