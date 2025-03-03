"use client";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import { motion } from "framer-motion";

export default function Controls() {
  const { connect, disconnect, readyState, pauseAssistant, resumeAssistant } = useVoice();

  return (
    <motion.div 
      className="bg-black/80 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className={`w-2 h-2 rounded-full ${
          readyState === VoiceReadyState.OPEN ? 'bg-green-500' : 'bg-zinc-500'
        }`} />
        
        {/* Control button */}
        {readyState === VoiceReadyState.OPEN ? (
          <button
            className="text-red-500 hover:text-red-400 font-medium transition-colors"
            onClick={() => disconnect()}
          >
            End Voice Chat
          </button>
        ) : (
          <button
            className="text-green-500 hover:text-green-400 font-medium flex-center transition-colors"
            onClick={() => connect()}
          >
            Start Voice Chat
          </button>
        )}
      </div>
    </motion.div>
  );
}