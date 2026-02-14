"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState, useCallback, useRef } from "react";
import { Heading, Text, Skeleton, Badge } from "@/app/components/ui";
import { Mail } from "lucide-react";
import Tilt from "react-parallax-tilt";

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
  const [activeId, setActiveId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const userId = session?.user?.id;
  const activeMessage = messages.find((m) => m.id === activeId) ?? null;

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
    if (!userId) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 60000);
    const handleRead = () => fetchMessages();
    window.addEventListener("inbox:read", handleRead);
    return () => {
      clearInterval(interval);
      window.removeEventListener("inbox:read", handleRead);
    };
  }, [userId, fetchMessages]);

  const markAsRead = useCallback(
    async (message: Message) => {
      if (!message.is_read && userId) {
        await fetch("/api/inbox", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, messageId: message.id }),
        });
        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? { ...m, is_read: true } : m)),
        );
        window.dispatchEvent(new CustomEvent("inbox:read"));
      }
    },
    [userId],
  );

  //Skeleton Render for Inbox Notifs
  if (sessionPending || loading) {
    return (
      <div>
        <Heading level="h3" gradient>
          Inbox
        </Heading>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height="120px" />
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
        <>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((message) => (
              <Tilt
                key={message.id}
                glareEnable={true}
                glareMaxOpacity={0.2}
                scale={1.05}
                transitionSpeed={500}
                tiltMaxAngleX={5}
                tiltMaxAngleY={5}
                className={`rounded-lg transition-all ${
                  activeId && activeId !== message.id
                    ? "grayscale blur-[2px]"
                    : ""
                }`}
              >
                <div
                  className="rounded-lg bg-(--theme-card-bg) shadow border border-(--theme-card-border) cursor-pointer"
                  onClick={() => {
                    setActiveId(message.id);
                    markAsRead(message);
                  }}
                >
                  <div className="p-4 sm:p-5 min-h-[120px] flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <Text size="base" className="min-w-0">
                        {message.title}
                      </Text>
                      {!message.is_read && (
                        <Badge variant="error" size="sm">
                          Unread
                        </Badge>
                      )}
                    </div>
                    <Text size="sm" variant="secondary" className="mt-3">
                      {formatRelativeTime(message.created_at)}
                    </Text>
                  </div>
                </div>
              </Tilt>
            ))}
          </div>

          {/* Expanded message overlay */}
          {activeMessage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
              onClick={(e) => {
                if (
                  panelRef.current &&
                  !panelRef.current.contains(e.target as Node)
                ) {
                  setActiveId(null);
                }
              }}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              <Tilt
                glareEnable={true}
                glareMaxOpacity={0.15}
                tiltMaxAngleX={2}
                tiltMaxAngleY={2}
                transitionSpeed={500}
                className="relative z-10 w-full max-w-lg max-h-[80vh]"
              >
                <div
                  ref={panelRef}
                  className="rounded-lg border border-(--theme-card-border) bg-(--theme-card-bg)/95 backdrop-blur-sm shadow-2xl p-6 sm:p-8 flex flex-col max-h-[80vh] overflow-y-auto"
                >
                  <Heading level="h4" animate={false} className="mb-2">
                    {activeMessage.title}
                  </Heading>
                  {activeMessage.sender_name && (
                    <Text size="sm" variant="secondary" className="mb-4">
                      From: {activeMessage.sender_name}
                    </Text>
                  )}
                  <Text size="base" className="whitespace-pre-wrap flex-1">
                    {activeMessage.body}
                  </Text>
                  <Text
                    size="sm"
                    variant="secondary"
                    className="mt-4 pt-3 border-t border-[--theme-card-border]"
                  >
                    {formatRelativeTime(activeMessage.created_at)}
                  </Text>
                </div>
              </Tilt>
            </div>
          )}
        </>
      )}
    </div>
  );
}
