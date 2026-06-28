import { supabaseServer } from "./supabase-server";

/* ---------------- GET ---------------- */

export async function getRecommendations() {
  const { data, error } = await supabaseServer
    .from("recommendations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getRecommendations error:", error);
    return [];
  }

  return data;
}

/* ---------------- UPDATE STATUS ---------------- */

export async function updateRecommendationStatus(
  id: number,
  status: "Approved" | "Rejected"
) {
  const { data, error } = await supabaseServer
    .from("recommendations")
    .update({ status })
    .eq("id", id)
    .select();

  if (error) {
    console.error("updateRecommendationStatus error:", error);
    return null;
  }

  return data;
}