import { supabaseServer } from "./supabase-server";

/* ---------------- GET ALL BOOKS ---------------- */

export async function getBooks() {
  const { data, error } = await supabaseServer
    .from("books")
    .select("*")
    .order("id");

  if (error) {
    console.error("getBooks error:", error);
    return [];
  }

  return data;
}

/* ---------------- GET ONE BOOK ---------------- */

export async function getBookById(id: number) {
  const { data, error } = await supabaseServer
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getBookById error:", error);
    return null;
  }

  return data;
}

/* ---------------- CURRENT PICK ---------------- */

export async function getCurrentBookClubPick() {
  const { data, error } = await supabaseServer
    .from("books")
    .select("*")
    .eq("is_current_book_club_pick", true)
    .single();

  if (error) {
    console.error("getCurrentBookClubPick error:", error);
    return null;
  }

  return data;
}

/* ---------------- PAST SELECTIONS ---------------- */

export async function getPastBookClubSelections() {
  const { data, error } = await supabaseServer
    .from("books")
    .select("*")
    .eq("is_book_club_selection", true)
    .eq("is_current_book_club_pick", false)
    .order("id");

  if (error) {
    console.error("getPastBookClubSelections error:", error);
    return [];
  }

  return data;
}

/* ---------------- CREATE BOOK ---------------- */

export async function createBook(
  book: Record<string, any>
) {
  const { data, error } = await supabaseServer
    .from("books")
    .insert(book)
    .select()
    .single();

  if (error) {
    console.error("createBook error:", error);
    return null;
  }

  return data;
}

/* ---------------- UPDATE BOOK ---------------- */

export async function updateBook(
  id: number,
  updates: Record<string, any>
) {
  const { data, error } = await supabaseServer
    .from("books")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateBook error:", error);
    return null;
  }

  return data;
}

/* ---------------- DELETE BOOK ---------------- */

export async function deleteBook(id: number) {
  const { error } = await supabaseServer
    .from("books")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteBook error:", error);
    return false;
  }

  return true;
}