import { supabaseServer } from "./supabase-server";

/* ---------------- GET REQUESTS ---------------- */

export async function getRequests() {
  const { data, error } = await supabaseServer
    .from("requests")
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getRequests error:", error);
    return [];
  }

  return data;
}

/* ---------------- UPDATE REQUEST STATUS ---------------- */

export async function updateRequestStatus(
  id: number,
  status: "Approved" | "Rejected" | "Returned"
) {
  // 1. Update request status
  const { data, error } = await supabaseServer
    .from("requests")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateRequestStatus error:", error);
    return null;
  }

  const bookTitle = data.book;

  // 2. APPROVED → book becomes Checked Out
  if (status === "Approved") {
    const { error: bookError } = await supabaseServer
      .from("books")
      .update({ status: "Checked Out" })
      .eq("title", bookTitle);

    if (bookError) {
      console.error("book status update error:", bookError);
    }
  }

  // 3. RETURNED → book becomes Available
  if (status === "Returned") {
    const { error: bookError } = await supabaseServer
      .from("books")
      .update({ status: "Available" })
      .eq("title", bookTitle);

    if (bookError) {
      console.error("book return update error:", bookError);
    }
  }

  return data;
}

/* ---------------- ARCHIVE REQUEST ---------------- */

export async function archiveRequest(id: number) {
  const { error } = await supabaseServer
    .from("requests")
    .update({ archived: true })
    .eq("id", id);

  if (error) {
    console.error("archiveRequest error:", error);
    return false;
  }

  return true;
}