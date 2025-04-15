'use client';

import { useConversation } from '@11labs/react';
import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Conversation() {
  const [expanded, setExpanded] = useState(false);
  
  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: 'xiZywWxlRPOTG9ZGUGjI',
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="fixed top left-1/2 -translate-x-1/2 z-50">
      <motion.div 
        className="bg-green-900 text-white rounded-lg shadow-lg overflow-hidden"
        animate={{
          width: expanded ? 700 : 100,
          height: expanded ? 270 : 32,
          borderRadius: expanded ? 12 : 8,
        }}
        onClick={() => setExpanded(!expanded)}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <AnimatePresence>
          <motion.div className="p-4 h-full">
            {!expanded ? (
              <motion.div className="flex items-center justify-center h-full">
                <span className={`w-3 h-3 rounded-full mr-2 ${conversation.status === 'connected' ? 'bg-green-500' : 'bg-zinc-200'}`}></span>
                <p>{conversation.status === 'connected' ? 'Active' : 'Talk'}</p>
              </motion.div>
            ) : (
              <motion.div 
                className="flex flex-col h-full gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex justify-between items-center">
                  <p>Enki</p>
                  <span className={`w-3 h-3 rounded-full ${conversation.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startConversation();
                    }}
                    disabled={conversation.status === 'connected'}
                    className="px-3 py-1 bg-green-800 text-white rounded-full disabled:bg-gray-700"
                  >
                    Start
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      stopConversation();
                    }}
                    disabled={conversation.status !== 'connected'}
                    className="px-3 py-1 bg-red-500 text-white rounded-full disabled:bg-gray-700"
                  >
                    Stop
                  </button>
                </div>
                {conversation.status === 'connected' && (
                  <p className="text-sm text-center">
                    {conversation.isSpeaking ? 'Speaking...' : 'Listening...'}
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}