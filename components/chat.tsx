"use client";

import { Message } from "ai";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";
import { Files } from "@/components/files";
import { AnimatePresence, motion } from "framer-motion";
import { AttachmentIcon, FileIcon, MoreIcon, UploadIcon } from "@/components/icons";
import { Message as PreviewMessage } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import Link from "next/link";
import { Session } from "next-auth";
import Image from 'next/image';


const suggestedActions = [
  {
    title: "What's the summary",
    label: "of these documents?",
    action: "what's the summary of these documents?",
  },
  {
    title: "Who is the author",
    label: "of these documents?",
    action: "who is the author of these documents?",
  },
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
    <div className="flex flex-row justify-center h-dvh bg-white dark:bg-zinc-800">
      <div className="flex flex-col h-full justify-between items-center gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 flex-1 w-dvw items-center overflow-y-scroll"
        >
          {messages.map((message, index) => (
            <PreviewMessage
              key={`${id}-${index}`}
              role={message.role}
              content={message.content}
            />
          ))}
          <div
            ref={messagesEndRef}
            className="flex-shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>

        {messages.length === 0 && (
          <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px]">
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
                  className="w-full text-left border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                >
                  <span className="font-medium">{suggestedAction.title}</span>
                  <span className="text-zinc-400 dark:text-zinc-400">
                    {suggestedAction.label}
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
        )}

        <div className="w-full md:max-w-[500px] px-4 md:px-0 pb-5">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                className="bg-zinc-600 rounded-md pl-2 pr-16 py-5 w-full outline-none dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100"
                placeholder="Send a message..."
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-2 pl-2 text-sm bg-zinc-100 rounded-r-md flex-shrink-0 cursor-pointer hover:bg-zinc-200 dark:text-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-700"
                onClick={() => setIsFilesVisible(!isFilesVisible)}
              >
                <FileIcon />
                <motion.div
                  className="relative ml-1 text-xs bg-blue-500 size-5 rounded-full flex items-center justify-center border-2 dark:border-zinc-900 border-white text-blue-50"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {selectedFilePathnames?.length}
                </motion.div>
              </button>
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
