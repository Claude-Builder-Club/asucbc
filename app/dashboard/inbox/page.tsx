"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Heading, Text, Card, Skeleton } from "@/app/components/ui";
import { AnimatePresence, motion } from "framer-motion";
import { Mail } from "lucide-react";

interface Message {
  id: string;
  title: string;
  body: string;
  created_at: string;
  sender_name: string | null;
  is_read: boolean;
}

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default function InboxPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const expandedRef = useRef<HTMLDivElement | null>(null);

  const userId = session?.user?.id;

  // Fetching messages
  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/inbox?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchMessages();
  }, [userId, fetchMessages]);

  // Click outside to close expanded message
  useEffect(() => {
    if (!expandedId) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        expandedRef.current &&
        !expandedRef.current.contains(e.target as Node)
      ) {
        setExpandedId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expandedId]);

  const handleExpand = async (message: Message) => {
    if (expandedId === message.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(message.id);

    if (!message.is_read && userId) {
      await fetch("/api/inbox", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, messageId: message.id }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, is_read: true } : m)),
      );
    }
  };

  //Skeleton Render for Inbox Notifs
  if (sessionPending || loading) {
    return (
      <div>
        <Heading level="h3" gradient>
          Inbox
        </Heading>
        <div className="mt-6 flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height="4rem" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Heading level="h3" gradient>
        Inbox
      </Heading>

      {messages.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 opacity-60">
          <Mail size={48} strokeWidth={1.5} />
          <Text size="lg">No messages yet</Text>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {messages.map((message) => {
            const isExpanded = expandedId === message.id;

            return (
              <div key={message.id} ref={isExpanded ? expandedRef : undefined}>
                <Card
                  hoverable={!isExpanded}
                  animated={false}
                  className="cursor-pointer"
                  onClick={() => handleExpand(message)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {!message.is_read && (
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[--theme-text-accent]" />
                      )}
                      <Text
                        size="base"
                        className={
                          message.is_read ? "opacity-70" : "font-semibold"
                        }
                      >
                        {message.title}
                      </Text>
                    </div>
                    <Text size="sm" variant="secondary" className="shrink-0">
                      {formatRelativeTime(message.created_at)}
                    </Text>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 border-t border-[--theme-card-border] pt-4">
                          {message.sender_name && (
                            <Text
                              size="sm"
                              variant="secondary"
                              className="mb-2"
                            >
                              From: {message.sender_name}
                            </Text>
                          )}
                          <Text size="base" className="whitespace-pre-wrap">
                            {message.body}
                          </Text>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
