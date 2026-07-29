"use client";

import { useState, useRef, useEffect } from "react";

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

  return (
    <main className="min-h-screen bg-bg text-[var(--color-on-surface)] px-5 py-10">
      <div className="max-w-5xl mx-auto">
        {/* HERO */}
        <div className="grid gap-6 md:grid-cols-[2fr_1fr] mb-8">
          <div className="glass-card p-8">
            <span className="badge badge-mint mb-4 inline-block">
              System Status: Optimal
            </span>
            <h1 className="font-sora text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Automotive
              <br />
              <span className="text-[var(--color-secondary-light)]">
                Intelligence
              </span>
            </h1>
            <p className="text-[var(--color-on-surface-variant)] leading-relaxed max-w-md">
              Your concierge for real listings, comparisons, and buying
              guidance — grounded in what's actually available right now.
            </p>
          </div>

          <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="font-sora text-lg font-semibold mb-1">
              Ready to assist
            </h3>
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              Ask about listings, prices, or comparisons
            </p>
          </div>
        </div>

        {/* SUGGESTION CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => sendMessage(s.text)}
              className="glass-card p-5 text-left hover:bg-white/10 transition"
            >
              <span className="font-mono-label text-[var(--color-secondary-light)] block mb-2">
                {s.label}
              </span>
              <span className="text-[var(--color-on-surface)]">{s.text}</span>
            </button>
          ))}
        </div>

        {/* CHAT WINDOW */}
        <div className="glass-card overflow-hidden">
          <div
            ref={scrollRef}
            className="h-96 overflow-y-auto p-6 flex flex-col gap-3"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-4 py-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "self-end bg-[var(--color-secondary)] text-white"
                    : "self-start bg-surface-container text-[var(--color-on-surface)]"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {isLoading && (
              <div className="self-start text-sm text-[var(--color-on-surface-variant)] px-1">
                AI is thinking...
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex gap-3 p-4 border-t border-[var(--color-outline)]"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about specifications, market data, or vehicle history..."
              disabled={isLoading}
              className="input-dark flex-1 px-4 py-3"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}