import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("books")
      .select("*")
      .order("id");

    if (error) {
      console.error("API /books error:", error);
      return NextResponse.json([]);
    }

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Unexpected API error:", err);
    return NextResponse.json([]);
  }
}