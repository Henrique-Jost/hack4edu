"use client";

import { motion } from "framer-motion";
import { UserAvatarIcon, CompassIcon } from "./icons";
import { ReactNode } from "react";
import { Markdown } from "./markdown";

export const Message = ({
  role,
  content,
}: {
  role: string;
  content: string | ReactNode;
}) => {
  // Add console.log to debug
  //console.log('Message received:', { role, content });

  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[600px] md:px-2 mt:px2 pb-4 pt-4 border rounded-lg ${
        role === "assistant" ? "border-zinc-800" : "border-zinc-800 bg-zinc-800"
      }`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-100">
        {role === "assistant" ? <CompassIcon /> : <UserAvatarIcon />}
      </div>

      <div className="flex flex-col gap-6 w-full overflow-hidden">
        <div className="text-zinc-800 dark:text-zinc-100 flex flex-col gap-4 break-words">
          {typeof content === 'string' ? (
            <Markdown>{content}</Markdown>
          ) : (
            content
          )}
        </div>
      </div>
    </motion.div>
  );
};