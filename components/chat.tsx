"use client";

import { Message } from "ai";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";
import { Files } from "@/components/files";
import { AnimatePresence, motion } from "framer-motion";
import { AttachmentIcon, FileIcon, MoreIcon, SendIcon, UploadIcon } from "@/components/icons";
import { Message as PreviewMessage } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { UserFeedbackComponent } from "@/components/UserFeedbackComponent";
import Link from "next/link";
import { Session } from "next-auth";
import Image from 'next/image';
import { VoiceButton } from './VoiceButton';
import { AudioRecordButton } from "./AudioRecordButton";
import { Conversation } from '@/components/conversation';


const suggestedActions = [
  {
    title: "What's the summary",
    label: "of these documents?",
    action: "what's the summary of these documents?",
  },
  {
    title: "Tutor me",
    label: "on these documents?",
    action: "Tutor me on these documents?",
  },
  {
    title: "Can you identify risk",
    label: "points on these documents?",
    action: "Tutor me on these documents?",
  }
];

export function Chat({
  id,
  initialMessages,
  session,
}: {
  id: string;
  initialMessages: Array<Message>;
  session: Session | null;
}) {
  const [selectedFilePathnames, setSelectedFilePathnames] = useState<
    Array<string>
  >([]);
  const [isFilesVisible, setIsFilesVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted !== false && session && session.user) {
      localStorage.setItem(
        `${session.user.email}/selected-file-pathnames`,
        JSON.stringify(selectedFilePathnames),
      );
    }
  }, [selectedFilePathnames, isMounted, session]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (session && session.user) {
      setSelectedFilePathnames(
        JSON.parse(
          localStorage.getItem(
            `${session.user.email}/selected-file-pathnames`,
          ) || "[]",
        ),
      );
    }
  }, [session]);

  const { messages, handleSubmit, input, setInput, append } = useChat({
    body: { id, selectedFilePathnames },
    initialMessages,
    onFinish: () => {
      window.history.replaceState({}, "", `/${id}`);
    },
  });


  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div className="flex flex-row justify-center h-dvh bg-white dark:bg-stone-100 pt-12">
      <div className="flex flex-col h-full justify-between items-center gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 flex-1 w-dvw items-center overflow-y-scroll"
        >
          {messages.map((message, index) => (
            <div key={`${id}-${index}`} className="justify-center">
            <PreviewMessage
              role={message.role}
              content={message.content}
            />
            {message.role === "assistant" && (
              <div className="flex justify-end mt-1 mr-4">
                <UserFeedbackComponent traceId={id} />
                <VoiceButton text={message.content} />
              </div>
              
            )}
          </div>
          ))}
          <div
            ref={messagesEndRef}
            className="flex-shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>
        {messages.length === 0 && (
          <div className="grid sm:grid-cols-3 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[700px]">
            {suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={async () => {
                    append({
                      role: "user",
                      content: suggestedAction.action,
                    });
                  }}
                  className="w-full text-left border border-zinc-200 dark:border-zinc-300 text-zinc-300 dark:text-zinc-600 rounded-lg p-2 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-200 transition-colors flex flex-col"
                >
                  <span className="font-medium">{suggestedAction.title}</span>
                  <span className="text-zinc-100 dark:text-zinc-500">
                    {suggestedAction.label}
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
        )}

        <div className="w-full md:max-w-[700px] px-4 md:px-0 pb-5">
          <form onSubmit={handleSubmit}>
            <div className="relative bg-zinc-600 dark:bg-neutral-50 border border-zinc-200 rounded-lg overflow-hidden">
              {/* Textarea Section */}
              <textarea
                className="w-full pl-4 pr-2 pt-4 pb-2 bg-transparent outline-none text-zinc-800 dark:text-zinc-00 resize-none placeholder:text-left min-h-[80px]"
                placeholder="Send a message..."
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                }}
                rows={3}
              />
              
              {/* Button Section */}
              <div className="border-zinc-700 p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    type="button"
                    className="flex items-center gap-0.2 p-2 text-sm rounded-md cursor-pointer hover:bg-neutral-400 dark:text-zinc-900 transition-colors"
                    onClick={() => setIsFilesVisible(!isFilesVisible)}
                  >
                    <FileIcon />
                    <motion.div
                      className="relative text-xs bg-green-900 size-5 rounded-full flex items-center justify-center border-2 dark:border-zinc-900 border-white text-blue-50"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {selectedFilePathnames?.length}
                    </motion.div>
                  </button>

                  {/* Audio Mode */}
                  <AudioRecordButton onTranscriptionComplete={(text) => setInput(text)}></AudioRecordButton>
                  
                  {/* Enki live */}
                  <Conversation />

                </div>

                {/* Send Button */}
                
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 text-sm rounded-md cursor-pointer bg-green-900 hover:bg-neutral-800 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!input.trim()}
                >
                  <SendIcon></SendIcon>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <AnimatePresence>
        {isFilesVisible && (
          <Files
            setIsFilesVisible={setIsFilesVisible}
            selectedFilePathnames={selectedFilePathnames}
            setSelectedFilePathnames={setSelectedFilePathnames}
          />
        )}
      </AnimatePresence>
    </div>
  );
}