"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

type Book = {
  id: number;
  title: string;
  author: string;
  is_current_book_club_pick: boolean;
  book_club_date?: string | null;
  book_club_time?: string | null;
  book_club_location?: string | null;
  free_books_left?: number;
};

export default function BookClubAdminPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | "">("");

  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [freeBooksLeft, setFreeBooksLeft] = useState(0);

  /* ---------------- LOAD BOOKS ---------------- */
  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data || []);
      } catch (err) {
        console.error("Failed to load books:", err);
      }
    }

    loadBooks();
  }, []);

  /* ---------------- RESTORE SAVED FORM STATE ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem("bookClubAdminForm");

    if (!saved) return;

    try {
      const data = JSON.parse(saved);

      setSelectedBookId(data.selectedBookId ?? "");
      setDate(data.date ?? "");
      setTime(data.time ?? "");
      setLocation(data.location ?? "");
      setFreeBooksLeft(data.freeBooksLeft ?? 0);
    } catch (err) {
      console.error("Failed to restore form:", err);
    }
  }, []);

  /* ---------------- SAVE FORM STATE (PERSIST ACROSS NAVIGATION) ---------------- */
  useEffect(() => {
    localStorage.setItem(
      "bookClubAdminForm",
      JSON.stringify({
        selectedBookId,
        date,
        time,
        location,
        freeBooksLeft,
      })
    );
  }, [selectedBookId, date, time, location, freeBooksLeft]);

  /* ---------------- PREFILL WHEN BOOK SELECTED ---------------- */
  useEffect(() => {
    if (!selectedBookId) return;

    const book = books.find(
      (b) => b.id === Number(selectedBookId)
    );

    if (!book) return;

    setDate(book.book_club_date ?? "");
    setTime(book.book_club_time ?? "");
    setLocation(book.book_club_location ?? "");
    setFreeBooksLeft(book.free_books_left ?? 0);
  }, [selectedBookId, books]);

  /* ---------------- SUBMIT ---------------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedBookId) {
      alert("Please select a book.");
      return;
    }

    try {
      setLoading(true);

      const selectedId = Number(selectedBookId);

      const currentBook = books.find(
        (b) => b.is_current_book_club_pick
      );

      /* demote old pick */
      if (currentBook && currentBook.id !== selectedId) {
        await fetch(`/api/admin/books/${currentBook.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            is_current_book_club_pick: false,
            is_book_club_selection: true,
          }),
        });
      }

      /* set new pick */
      const res = await fetch(
        `/api/admin/books/${selectedId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            is_current_book_club_pick: true,
            is_book_club_selection: false,
            book_club_date: date,
            book_club_time: time,
            book_club_location: location,
            free_books_left: freeBooksLeft,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update book club pick");
      }

      /* clear saved draft AFTER success */
      localStorage.removeItem("bookClubAdminForm");

      alert("Book club updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold mb-8">
        Book Club Management
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 border rounded-lg p-6"
      >

        {/* BOOK SELECT */}
        <div>
          <label className="block font-medium mb-2">
            Select Current Book Club Pick
          </label>

          <select
            className="w-full border rounded-lg p-3"
            value={selectedBookId}
            onChange={(e) =>
              setSelectedBookId(
                e.target.value === ""
                  ? ""
                  : Number(e.target.value)
              )
            }
          >
            <option value="">Select a book</option>

            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} — {book.author}
              </option>
            ))}
          </select>
        </div>

        {/* DATE */}
        <div>
          <label className="block font-medium mb-2">
            Book Club Date
          </label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* TIME */}
        <div>
          <label className="block font-medium mb-2">
            Book Club Time
          </label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        {/* LOCATION */}
        <div>
          <label className="block font-medium mb-2">
            Book Club Location
          </label>

          <input
            type="text"
            className="w-full border rounded-lg p-3"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* FREE BOOKS LEFT */}
        <div>
          <label className="block font-medium mb-2">
            Free Books Left
          </label>

          <input
            type="number"
            min={0}
            className="w-full border rounded-lg p-3"
            value={freeBooksLeft}
            onChange={(e) =>
              setFreeBooksLeft(Number(e.target.value))
            }
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Updating..." : "Set Book Club Pick"}
        </button>
      </form>
    </main>
  );
}