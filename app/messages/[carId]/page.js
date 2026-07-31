"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";
import { playClickSound } from "../../../lib/playClickSound";
import { BlurFade } from "@/components/ui/blur-fade";

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const carId = params.carId;
  const withUserId = searchParams.get("with");

  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [otherUserId, setOtherUserId] = useState(null);
  const [car, setCar] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function setup() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) {
        router.push("/login");
        return;
      }

      setCurrentUserId(userData.user.id);
      setCurrentUserEmail(userData.user.email);

      const { data: carData, error: carError } = await supabase
        .from("cars")
        .select("id, make, model, seller_id, seller")
        .eq("id", carId)
        .single();

      if (carError || !carData) {
        setErrorMessage("This car listing could not be found.");
        setIsLoading(false);
        return;
      }

      setCar(carData);

      let resolvedOtherUserId = null;

      if (userData.user.id === carData.seller_id) {
        // Seller is viewing - the other person must be specified via ?with=
        resolvedOtherUserId = withUserId;
        if (!resolvedOtherUserId) {
          setErrorMessage(
            "No buyer specified for this conversation. Please open this chat from your inbox."
          );
          setIsLoading(false);
          return;
        }
      } else {
        // Buyer is viewing - the other person is the seller
        resolvedOtherUserId = carData.seller_id;
      }

      setOtherUserId(resolvedOtherUserId);

      const { data: existingMessages } = await supabase
        .from("messages")
        .select("*")
        .eq("car_id", carId)
        .or(
          `and(sender_id.eq.${userData.user.id},receiver_id.eq.${resolvedOtherUserId}),and(sender_id.eq.${resolvedOtherUserId},receiver_id.eq.${userData.user.id})`
        )
        .order("created_at", { ascending: true });

      setMessages(existingMessages || []);
      setIsLoading(false);

      // Mark received messages as read
      await supabase
        .from("messages")
        .update({ read: true })
        .eq("car_id", carId)
        .eq("sender_id", resolvedOtherUserId)
        .eq("receiver_id", userData.user.id)
        .eq("read", false);
    }

    setup();
  }, [carId, withUserId, router]);

  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    const channel = supabase
      .channel(`messages-${carId}-${currentUserId}-${otherUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `car_id=eq.${carId}`,
        },
        (payload) => {
          const msg = payload.new;
          const isRelevant =
            (msg.sender_id === currentUserId && msg.receiver_id === otherUserId) ||
            (msg.sender_id === otherUserId && msg.receiver_id === currentUserId);

          if (isRelevant) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [carId, currentUserId, otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();

    if (!newMessage.trim()) return;

    playClickSound();
    setIsSending(true);

    const { error } = await supabase.from("messages").insert({
      car_id: carId,
      sender_id: currentUserId,
      receiver_id: otherUserId,
      message: newMessage.trim(),
      sender_email: currentUserEmail,
    });

    setIsSending(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setNewMessage("");
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-slate-400">Loading conversation...</p>
        </div>
      </main>
    );
  }

  if (errorMessage && !car) {
    return (
      <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-red-400">{errorMessage}</p>
          <Link href="/messages" className="mt-4 inline-block font-semibold text-cyan-400">
            Back to inbox
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-[80vh] max-w-2xl flex-col rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="border-b border-slate-800 p-4">
          <Link href="/messages" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">
            ← Back to inbox
          </Link>
          <h1 className="mt-1 text-lg font-bold text-white">
            {car ? `${car.make} ${car.model}` : "Conversation"}
          </h1>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-slate-500">
              No messages yet. Say hello to start the conversation.
            </p>
          ) : (
            messages.map((msg, index) => {
              const isMine = msg.sender_id === currentUserId;
              return (
                <BlurFade
                  key={msg.id}
                  delay={index < 20 ? 0.02 * index : 0}
                  inView
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                      isMine
                        ? "bg-cyan-500 text-slate-950"
                        : "bg-slate-800 text-slate-100"
                    }`}
                  >
                    {msg.message}
                  </div>
                </BlurFade>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {errorMessage ? (
          <p className="px-4 text-sm text-red-400">{errorMessage}</p>
        ) : null}

        <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-800 p-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={isSending}
            className="rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}