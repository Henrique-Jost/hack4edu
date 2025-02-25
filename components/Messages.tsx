"use client";
import { useVoice } from "@humeai/voice-react";
import { motion } from "framer-motion";
import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";
import { useEffect, useRef } from "react";

export default function Messages() {
  const { messages } = useVoice();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 h-64 overflow-y-auto mt-4">
      {messages.map((msg, index) => {
        if (msg.type === "user_message" || msg.type === "assistant_message") {
          const role = msg.message.role;
          return (
            <motion.div
              key={msg.type + index}
              className="flex flex-row gap-4 text-zinc-300"
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-300">
                {role === "assistant" ? <BotIcon /> : <UserIcon />}
              </div>

              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-col gap-4">
                  <Markdown>{msg.message.content}</Markdown>
                </div>
              </div>
            </motion.div>
          );
        }
        return null;
      })}
      {/* This empty div is used as a reference for scrolling to the bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
}