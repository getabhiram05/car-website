"use client";

import { supabase } from "@/lib/supabaseClient";

export default function Test() {

  async function check() {
    const { data, error } = await supabase
      .from("carcyclopedia")
      .select("*");

    console.log("CARCYCLOPEDIA DATA:", data);
    console.log("ERROR:", error);
  }

  return (
    <button onClick={check}>
      Test Carcyclopedia
    </button>
  );
}