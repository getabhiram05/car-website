"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function MessageSellerButton({ carId, sellerId }) {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data?.user?.id || null);
      setIsLoading(false);
    }
    loadUser();
  }, []);

  if (isLoading) {
    return null;
  }

  if (!currentUserId) {
    return (
      <Link
        href="/login"
        className="inline-block rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
      >
        Log in to message seller
      </Link>
    );
  }

  if (currentUserId === sellerId) {
    return null;
  }

  return (
    <Link
      href={`/messages/${carId}`}
      className="inline-block rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
    >
      Message Seller
    </Link>
  );
}