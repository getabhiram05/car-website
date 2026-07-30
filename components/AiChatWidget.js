"use client";

import { useState, useRef, useEffect } from "react";
import { TypingAnimation } from "@/components/ui/typing-animation";

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Hi! I'm AI (Automotive Intelligence) 🚗 Tell me your budget, family size, or how you'll use the car, and I'll suggest cars that fit."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  async function handleSend(e) {
    e.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const newMessages = [...messages, { role: "user", text: trimmed }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", text: data.reply }
      ]);

    } catch (err) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "Sorry, I couldn't process that. Please try again."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const lastAssistantIndex = messages
    .map((m) => m.role)
    .lastIndexOf("assistant");

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-cyan-500 text-2xl text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400"
        aria-label="Open AI car assistant"
      >
        {isOpen ? "✕" : "🤖"}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[min(500px,calc(100vh-160px))] w-[min(360px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40">

          <div className="bg-[#05070d] px-4 py-3.5 text-sm font-bold text-white">
            AI — Automotive Intelligence
            <div className="mt-0.5 text-xs font-normal text-slate-500">
              Tell me what you need, I&apos;ll find the right car
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-slate-950/40 p-4"
          >

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "self-end bg-cyan-500 text-slate-950"
                    : "self-start bg-slate-800/80 text-slate-100"
                }`}
              >
                {msg.role === "assistant" && i === lastAssistantIndex ? (
                  <TypingAnimation
                    key={i}
                    duration={15}
                    className="whitespace-pre-wrap text-sm font-normal leading-relaxed text-slate-100"
                    as="span"
                  >
                    {msg.text}
                  </TypingAnimation>
                ) : (
                  msg.text
                )}
              </div>
            ))}

            {isLoading && (
              <div className="self-start px-1 py-1.5 text-[13px] text-slate-500">
                AI is thinking...
              </div>
            )}

          </div>

          <form
            onSubmit={handleSend}
            className="flex gap-2 border-t border-slate-800 bg-slate-900 p-2.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Family car under 8 lakh, diesel"
              disabled={isLoading}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-cyan-500 px-4 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </form>

        </div>
      )}
    </>
  );
}