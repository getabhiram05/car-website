"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { BlurFade } from "@/components/ui/blur-fade";

export default function InboxPage() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadInbox() {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) {
        router.push("/login");
        return;
      }

      setCurrentUserId(userData.user.id);

      const { data: allMessages, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${userData.user.id},receiver_id.eq.${userData.user.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      // Group messages into conversations by car_id + other person
      const grouped = new Map();

      for (const msg of allMessages || []) {
        const otherUserId =
          msg.sender_id === userData.user.id ? msg.receiver_id : msg.sender_id;
        const key = `${msg.car_id}-${otherUserId}`;

        if (!grouped.has(key)) {
          grouped.set(key, {
            carId: msg.car_id,
            otherUserId,
            lastMessage: msg.message,
            lastMessageTime: msg.created_at,
            otherPersonEmail:
              msg.sender_id === otherUserId ? msg.sender_email : null,
            unread:
              msg.receiver_id === userData.user.id && !msg.read ? 1 : 0,
          });
        } else {
          const existing = grouped.get(key);
          if (
            msg.receiver_id === userData.user.id &&
            !msg.read &&
            new Date(msg.created_at) <= new Date(existing.lastMessageTime)
          ) {
            existing.unread += 1;
          }
          if (!existing.otherPersonEmail && msg.sender_id === otherUserId) {
            existing.otherPersonEmail = msg.sender_email;
          }
        }
      }

      const conversationList = Array.from(grouped.values());

      // Fetch car details for each conversation
      const carIds = [...new Set(conversationList.map((c) => c.carId))];
      const { data: carsData } = await supabase
        .from("cars")
        .select("id, make, model, seller_id, seller")
        .in("id", carIds.length > 0 ? carIds : ["none"]);

      const carsMap = new Map((carsData || []).map((c) => [c.id, c]));

      const enriched = conversationList.map((conv) => {
        const car = carsMap.get(conv.carId);
        const otherLabel =
          car && car.seller_id === conv.otherUserId
            ? car.seller
            : conv.otherPersonEmail || "Buyer";

        return {
          ...conv,
          carLabel: car ? `${car.make} ${car.model}` : "Unknown car",
          otherLabel,
        };
      });

      setConversations(enriched);
      setIsLoading(false);
    }

    loadInbox();
  }, [router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-slate-400">Loading your messages...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070d] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-white">Messages</h1>

        {errorMessage ? (
          <p className="text-sm text-red-400">{errorMessage}</p>
        ) : null}

        {conversations.length === 0 ? (
          <p className="text-sm text-slate-500">
            No conversations yet. Message a seller from a car listing to
            start one.
          </p>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv, index) => (
              <BlurFade
                key={`${conv.carId}-${conv.otherUserId}`}
                delay={0.05 * index}
                inView
              >
                <Link
                  href={
                    currentUserId
                      ? `/messages/${conv.carId}?with=${conv.otherUserId}`
                      : "#"
                  }
                  className="block rounded-2xl border border-slate-800 bg-slate-900/50 p-4 transition hover:border-cyan-600"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">
                        {conv.carLabel}
                      </p>
                      <p className="text-sm text-slate-400">
                        {conv.otherLabel}
                      </p>
                    </div>
                    {conv.unread > 0 ? (
                      <span className="rounded-full bg-cyan-500 px-2 py-1 text-xs font-bold text-slate-950">
                        {conv.unread}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 truncate text-sm text-slate-500">
                    {conv.lastMessage}
                  </p>
                </Link>
              </BlurFade>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}