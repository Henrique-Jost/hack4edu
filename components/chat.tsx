"use client";

import { Message } from "ai";
import { useChat } from "ai/react";
import { useEffect, useState, useRef } from "react";
import { Files } from "@/components/files";
import { AnimatePresence, motion } from "framer-motion";
import { AttachmentIcon, FileIcon, MoreIcon, SendIcon, UploadIcon, ImageIcon } from "@/components/icons";
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
  // ... existing state ...
  const [selectedFilePathnames, setSelectedFilePathnames] = useState<
    Array<string>
  >([]);
  const [isFilesVisible, setIsFilesVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // ... useEffect hooks ...

  const { messages, handleSubmit, input, setInput, append } = useChat({
    body: { id, selectedFilePathnames },
    initialMessages,
    onFinish: () => {
      window.history.replaceState({}, "", `/${id}`);
    },
  });

  // multimodal input state and ref (already added)
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);


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
            <div key={`${id}-${index}-${message.id}`} className="justify-center w-full md:max-w-[700px] px-4 md:px-0"> {/* Added message.id to key for better stability */}
              <PreviewMessage
                role={message.role}
                content={message.content}
              />
              {/* Display attached images for both user and assistant messages */}
              {message.experimental_attachments && message.experimental_attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 pl-10"> {/* Adjust styling as needed */}
                  {message.experimental_attachments
                    .filter(attachment => attachment.contentType?.startsWith('image/'))
                    .map((attachment, attachIndex) => (
                      <Image // Use Next.js Image component
                        key={`${message.id}-attach-${attachIndex}`}
                        src={attachment.url} // The SDK provides a temporary URL
                        width={100} // Adjust size as needed
                        height={100}
                        alt={attachment.name ?? `attachment-${attachIndex}`}
                        className="rounded object-cover" // Example styling
                      />
                  ))}
                </div>
              )}
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
        {/* ... Suggested Actions ... */}
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
          {/* Update the form's onSubmit handler */}
          <form onSubmit={event => {
            handleSubmit(event, {
              experimental_attachments: imageFiles ?? undefined, // Pass undefined if null
            });
            // Clear state and input after submit
            setImageFiles(null);
            if (imageInputRef.current) {
              imageInputRef.current.value = '';
            }
          }}>
            <div className="relative bg-zinc-600 dark:bg-neutral-50 border border-zinc-200 rounded-lg overflow-hidden">
              {/* Textarea Section */}
              <textarea
                className="w-full pl-4 pr-2 pt-4 pb-2 bg-transparent outline-none text-zinc-800 dark:text-zinc-00 resize-none placeholder:text-left min-h-[80px]"
                placeholder="Send a message or drop an image..." // Updated placeholder
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                }}
                rows={3}
              />

              {/* Display selected image previews (optional but good UX) */}
              {imageFiles && imageFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 pl-4 border-zinc-100 dark:border-zinc-700">
                  {Array.from(imageFiles).map((file, index) => (
                     <div key={index} className="relative">
                      <Image
                        src={URL.createObjectURL(file)} // Create temporary URL for preview
                        width={60}
                        height={60}
                        alt={file.name}
                        className="rounded object-cover"
                        onLoad={e => URL.revokeObjectURL(e.currentTarget.src)} // Clean up object URL
                      />
                       <button
                         type="button"
                         onClick={() => {
                           const dt = new DataTransfer();
                           const remainingFiles = Array.from(imageFiles).filter((_, i) => i !== index);
                           remainingFiles.forEach(f => dt.items.add(f));
                           setImageFiles(dt.files.length > 0 ? dt.files : null);
                           if (imageInputRef.current) {
                              imageInputRef.current.files = dt.files; // Update input's files
                           }
                         }}
                         className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 text-xs leading-none"
                         aria-label="Remove image"
                       >
                         &times;
                       </button>
                     </div>
                  ))}
                </div>
              )}

              {/* Button Section */}
              <div className="border-zinc-200 dark:border-zinc-700 p-3 flex items-center justify-between"> {/* Added border-t */}
                <div className="flex items-center gap-2"> {/* Added gap */}
                  {/* Persistent File Button */}
                  <button
                    type="button"
                    className="flex items-center gap-0.2 p-2 text-sm rounded-md cursor-pointer hover:bg-neutral-400 dark:text-zinc-900 transition-colors"
                    onClick={() => setIsFilesVisible(!isFilesVisible)}
                    title="Manage context files" // Added title
                  >
                    <FileIcon />
                    <motion.div
                      className="relative text-xs bg-green-900 size-5 rounded-full flex items-center justify-center border-2 dark:border-zinc-900 border-white text-white" // Adjusted colors
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      key={selectedFilePathnames?.length ?? 0} // Added key for animation trigger
                    >
                      {selectedFilePathnames?.length ?? 0}
                    </motion.div>
                  </button>

                  {/* Image Attachment Button */}
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="p-2 text-sm rounded-md cursor-pointer hover:bg-neutral-400 dark:text-zinc-900 transition-colors"
                    title="Attach images" // Added title
                  >
                    <ImageIcon /> {/* Using AttachmentIcon */}
                  </button>
                  {/* Hidden File Input for Images */}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={imageInputRef}
                    onChange={event => {
                      if (event.target.files && event.target.files.length > 0) {
                        setImageFiles(event.target.files);
                      } else {
                         // Handle case where user cancels file selection
                         if (imageFiles === null) { // Only clear if nothing was selected before
                             setImageFiles(null);
                         }
                      }
                    }}
                    className="hidden" // Keep it hidden
                  />

                  {/* Audio Mode */}
                  <AudioRecordButton onTranscriptionComplete={(text) => setInput(text)} />

                  {/* Enki live */}
                  <Conversation />

                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 text-sm rounded-md cursor-pointer bg-green-900 hover:bg-gray-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" // Adjusted colors
                  disabled={!input.trim() && (!imageFiles || imageFiles.length === 0)} // Disable if no text AND no images
                >
                  Send
                  <SendIcon />
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

