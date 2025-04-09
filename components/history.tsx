"use client";

import { motion, AnimatePresence } from "framer-motion";
import { InfoIcon, MenuIcon, PencilEditIcon, TrashIcon, PlusIcon } from "./icons";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import cx from "classnames";
import { useParams, usePathname } from "next/navigation";
import { Chat } from "@/schema";
import { fetcher } from "@/utils/functions";

export const History = () => {
  const { id } = useParams();
  const pathname = usePathname();
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  
  const {
    data: history,
    error,
    isLoading,
    mutate,
  } = useSWR<Array<Chat>>("/api/history", fetcher, {
    fallbackData: [],
  });

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Prevent event bubbling
    
    try {
      const response = await fetch(`/api/history/${chatId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh the history after successful deletion
        mutate();
      } else {
        const errorData = await response.json();
        console.error('Failed to delete chat:', errorData);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  useEffect(() => {
    mutate();
  }, [pathname, mutate]);

  return (
    <>
      <div
        className="dark:text-zinc-800 text-zinc-500 cursor-pointer"
        onClick={() => {
          setIsHistoryVisible(true);
        }}
      >
        <MenuIcon />
      </div>

      <AnimatePresence>
        {isHistoryVisible && (
          <>
            <motion.div
              className="fixed bg-zinc-900/50 h-dvh w-dvw top-0 left-0 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsHistoryVisible(false);
              }}
            />

            <motion.div
              className="fixed top-0 left-0 w-80 h-dvh p-3 flex flex-col gap-6 bg-white bg-stone-300 z-20"
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
              <div className="text-sm flex flex-row items-center justify-between">
                <div className="flex flex-row gap-2">
                  <div className="dark:text-zinc-800">History</div>
                  <div className="dark:text-zinc-500 text-zinc-500">
                    {history === undefined ? "loading" : history.length} chats
                  </div>
                </div>

                <Link
                  href="/"
                  className="dark:text-zinc-400 dark:bg-green-900 hover:dark:bg-zinc-600 bg-zinc-100 hover:bg-zinc-800 p-1.5 rounded-md cursor-pointer"
                  onClick={() => {
                    setIsHistoryVisible(false);
                  }}
                >
                  <PlusIcon />
                </Link>
              </div>

              <div className="flex flex-col overflow-y-scroll">
                {error && error.status === 401 ? (
                  <div className="text-zinc-500 h-dvh w-full flex flex-row justify-center items-center text-sm gap-2">
                    <InfoIcon />
                    <div>Login to save and revisit previous chats!</div>
                  </div>
                ) : null}

                {!isLoading && history?.length === 0 && !error ? (
                  <div className="text-zinc-800 h-dvh w-full flex flex-row justify-center items-center text-sm gap-2">
                    <InfoIcon />
                    <div>No chats found</div>
                  </div>
                ) : null}

                {isLoading && !error ? (
                  <div className="flex flex-col w-full">
                    {[44, 32, 28, 52].map((item) => (
                      <div
                        key={item}
                        className="p-2 border-b dark:border-zinc-700"
                      >
                        <div
                          className={`w-${item} h-[20px] bg-zinc-200 dark:bg-zinc-600 animate-pulse`}
                        />
                      </div>
                    ))}
                  </div>
                ) : null}

                {history &&
                  history.map((chat) => (
                    <div
                      key={chat.id}
                      className={cx(
                        "p-2 rounded-lg dark:text-zinc-600 border-b dark:border-zinc-700 text-sm dark:hover:bg-zinc-200 hover:bg-zinc-200 last-of-type:border-b-0 flex justify-between items-center",
                        {
                          "dark:bg-stone-200 bg-zinc-200": id === chat.id,
                        },
                      )}
                    >
                      <Link
                        href={`/${chat.id}`}
                        className="flex-1"
                      >
                        {chat.messages[0].content as string}
                      </Link>
                      <button
                        onClick={(e) => deleteChat(chat.id, e)}
                        className="p-1.5 rounded-md hover:bg-zinc-300 transition-colors"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};