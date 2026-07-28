"use client";

import { useState, useRef, useEffect } from "react";

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

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 50,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#2563eb",
          color: "white",
          border: "none",
          boxShadow: "0 10px 25px rgba(37,99,235,.4)",
          cursor: "pointer",
          fontSize: "26px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
        aria-label="Open AI car assistant"
      >
        {isOpen ? "✕" : "🤖"}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "96px",
            right: "24px",
            zIndex: 50,
            width: "min(360px, calc(100vw - 32px))",
            height: "min(500px, calc(100vh - 160px))",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 20px 50px rgba(15,23,42,.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #e2e8f0"
          }}
        >

          <div
            style={{
              background: "#0f172a",
              color: "white",
              padding: "14px 16px",
              fontWeight: "700",
              fontSize: "15px"
            }}
          >
            AI — Automotive Intelligence
            <div
              style={{
                fontWeight: "400",
                fontSize: "12px",
                color: "#94a3b8",
                marginTop: "2px"
              }}
            >
              Tell me what you need, I'll find the right car
            </div>
          </div>

          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              background: "#f8fafc"
            }}
          >

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  background: msg.role === "user" ? "#2563eb" : "white",
                  color: msg.role === "user" ? "white" : "#0f172a",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  fontSize: "14px",
                  lineHeight: "1.4",
                  boxShadow:
                    msg.role === "user"
                      ? "none"
                      : "0 2px 8px rgba(15,23,42,.08)",
                  whiteSpace: "pre-wrap"
                }}
              >
                {msg.text}
              </div>
            ))}

            {isLoading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  color: "#94a3b8",
                  fontSize: "13px",
                  padding: "6px 4px"
                }}
              >
                AI is thinking...
              </div>
            )}

          </div>

          <form
            onSubmit={handleSend}
            style={{
              display: "flex",
              borderTop: "1px solid #e2e8f0",
              padding: "10px",
              gap: "8px",
              background: "white"
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Family car under 8 lakh, diesel"
              disabled={isLoading}
              style={{
                flex: 1,
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                padding: "10px 12px",
                fontSize: "14px",
                outline: "none"
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "0 16px",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                opacity: isLoading ? 0.6 : 1
              }}
            >
              Send
            </button>
          </form>

        </div>
      )}
    </>
  );
}