"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
};

type StreamSpeed = "INSTANT" | "SLOW" | "FAST" | "NORMAL";

const initialMessages: ChatMessage[] = [];

const streamDelayBySpeed: Record<StreamSpeed, number> = {
  INSTANT: 0,
  FAST: 12,
  NORMAL: 24,
  SLOW: 45,
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [briefPrompt, setBriefPrompt] = useState<string | null>(null);
  const [openingLine, setOpeningLine] = useState<string | null>(null);
  const [streamSpeed, setStreamSpeed] = useState<StreamSpeed>("NORMAL");
  const [aiName, setAiName] = useState("AI");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isMounted = true;

    async function loadBrief() {
      try {
        const response = await fetch("/api/chat-preferences/brief");
        if (!response.ok) {
          throw new Error("Failed to load brief prompt.");
        }
        const data = (await response.json()) as {
          prompt?: string;
          openingMessage?: string;
          preference?: { streamSpeed?: StreamSpeed; name?: string };
        };
        if (isMounted) {
          setBriefPrompt(data.prompt ?? null);
          setOpeningLine(data.openingMessage ?? null);
          setStreamSpeed(data.preference?.streamSpeed ?? "NORMAL");
          setAiName(data.preference?.name?.trim() || "AI");
        }
      } catch {
        if (isMounted) {
          setBriefPrompt(null);
          setOpeningLine(null);
          setStreamSpeed("NORMAL");
          setAiName("AI");
        }
      }
    }

    loadBrief();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!openingLine || !isOpen) {
      return;
    }

    setMessages((prev) => {
      if (prev.length === 0) {
        return [{ id: "welcome", role: "ai", content: openingLine }];
      }
      if (prev[0]?.id === "welcome") {
        return [{ id: "welcome", role: "ai", content: openingLine }, ...prev.slice(1)];
      }
      return prev;
    });
  }, [openingLine, isOpen]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isOpen) {
      return;
    }
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [messages, isOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const payloadMessages = [
        ...(briefPrompt
          ? [{ role: "system", content: briefPrompt }]
          : []),
        ...nextMessages.map((message) => ({
          role: message.role === "ai" ? "assistant" : "user",
          content: message.content,
        })),
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI response.");
      }

      const data = (await response.json()) as { text?: string };
      const reply = data.text?.trim() || "Maaf, belum ada balasan.";

      const delay = streamDelayBySpeed[streamSpeed];
      if (delay === 0) {
        setMessages((prev) => [
          ...prev,
          { id: `ai-${Date.now()}`, role: "ai", content: reply },
        ]);
      } else {
        const messageId = `ai-${Date.now()}`;
        setMessages((prev) => [...prev, { id: messageId, role: "ai", content: "" }]);

        let index = 0;
        const interval = setInterval(() => {
          index += 1;
          setMessages((prev) =>
            prev.map((message) =>
              message.id === messageId
                ? { ...message, content: reply.slice(0, index) }
                : message,
            ),
          );
          if (index >= reply.length) {
            clearInterval(interval);
          }
        }, delay);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: "Terjadi masalah saat menghubungi AI.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter") {
      return;
    }
    if (event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    const form = event.currentTarget.form;
    if (form) {
      form.requestSubmit();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen ? (
        <div className="w-[320px] max-w-[90vw] overflow-hidden rounded-2xl border border-[color:var(--panel-border)] bg-[color:var(--panel)] shadow-[0_24px_60px_rgba(10,18,40,0.2)]">
          <div className="flex items-center justify-between border-b border-[color:var(--panel-border)] bg-gradient-to-r from-[#1f4bd8]/10 via-transparent to-[#3b82f6]/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">{aiName}</p>
              <p className="text-xs text-[color:var(--muted)]">
                AI Powered Chatbot
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup chat"
              className="rounded-full border border-[color:var(--panel-border)] p-2 text-[color:var(--muted)] transition hover:text-[color:var(--foreground)]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="M6 6 18 18" />
              </svg>
            </button>
          </div>

          <div
            ref={scrollRef}
            className="max-h-64 space-y-3 overflow-y-auto px-4 py-4 text-sm"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "ml-auto w-fit max-w-[85%] rounded-2xl bg-[color:var(--accent-1)] px-3 py-2 text-white"
                    : "mr-auto w-fit max-w-[85%] rounded-2xl border border-[color:var(--panel-border)] bg-white/60 px-3 py-2 text-[color:var(--foreground)]"
                }
              >
                {message.content}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 border-t border-[color:var(--panel-border)] px-4 py-3"
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={isSending}
              placeholder="Ketik pesan..."
              rows={2}
              className="flex-1 resize-none rounded-2xl border border-[color:var(--panel-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)] disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="submit"
              aria-label="Kirim pesan"
              disabled={isSending}
              className="self-center rounded-full bg-[color:var(--accent-1)] p-2 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-full bg-[color:var(--accent-1)] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(31,75,216,0.3)] transition hover:opacity-95"
      >
        {isOpen ? "Sembunyikan chat" : "Chat AI"}
      </button>
    </div>
  );
}
