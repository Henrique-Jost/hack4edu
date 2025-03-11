"use client";

import { VoiceProvider } from "@humeai/voice-react";
import Controls from "./Controls";
import Messages from "./Messages"

export default function ClientComponent({
  accessToken, configId
}: {
  accessToken: string;
  configId: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-zinc-200">
      <div className="flex w-full max-w-5xl gap-8 p-6">
        {/* Left Section - Avatar and Controls */}
        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-4xl">
            🧭
          </div>
          <div className="w-64">
          <VoiceProvider 
              auth={{ type: "accessToken", value: accessToken }} 
              configId={configId} //configId instead of hardcoded value
            >
                <Controls />
                <Messages />
            </VoiceProvider>
          </div>
        </div>
      </div>
    </div>
  );
}