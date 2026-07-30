"use client";

import { useState, useRef, useEffect } from "react";
import { TypingAnimation } from "@/components/ui/typing-animation";

const SUGGESTIONS = [
  {
    label: "Comparison Engine",
    text: "Compare a Hyundai Creta vs a Tata Nexon for a family",
  },
  {
    label: "Market Valuation",
    text: "What's a fair price for a 2019 Maruti Swift?",
  },
  {
    label: "Intelligence Filter",
    text: "List the best SUVs under 10 lakh",
  },
  {
    label: "Trend Analytics",
    text: "What should I look for when buying a used diesel car?",
  },
];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm AI — Automotive Intelligence. Tell me your budget, family size, or how you'll use the car, and I'll suggest cars that fit from our real listings.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const newMessages = [...messages, { role: "user", text: trimmed }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", text: data.reply },
      ]);
    } catch (err) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  const lastAssistantIndex = messages
    .map((m) => m.role)
    .lastIndexOf("assistant");

  return (
    <main className="min-h-screen bg-[#05070d] px-5 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl">
        {/* HERO */}
        <div className="mb-8 grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur">
            <span className="mb-4 inline-block rounded-full bg-cyan-500/10 px-3.5 py-1.5 text-xs font-bold text-cyan-300">
              System Status: Optimal
            </span>
            <h1 className="mb-4 text-4xl font-extrabold leading-tight text-white md:text-5xl">
              Automotive
              <br />
              <span className="text-cyan-400">Intelligence</span>
            </h1>
            <p className="max-w-md leading-relaxed text-slate-400">
              Your concierge for real listings, comparisons, and buying
              guidance — grounded in what&apos;s actually available right now.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur">
            <div className="mb-3 text-4xl">🤖</div>
            <h3 className="mb-1 text-lg font-semibold text-white">
              Ready to assist
            </h3>
            <p className="text-sm text-slate-400">
              Ask about listings, prices, or comparisons
            </p>
          </div>
        </div>

        {/* SUGGESTION CARDS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => sendMessage(s.text)}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-left backdrop-blur transition hover:bg-slate-800/60"
            >
              <span className="mb-2 block font-mono text-sm text-cyan-400">
                {s.label}
              </span>
              <span className="text-slate-200">{s.text}</span>
            </button>
          ))}
        </div>

        {/* CHAT WINDOW */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur">
          <div
            ref={scrollRef}
            className="flex h-96 flex-col gap-3 overflow-y-auto p-6"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "self-end bg-cyan-500 text-slate-950"
                    : "self-start bg-slate-800/70 text-slate-100"
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
              <div className="self-start px-1 text-sm text-slate-400">
                AI is thinking...
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex gap-3 border-t border-slate-800 p-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about specifications, market data, or vehicle history..."
              disabled={isLoading}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}