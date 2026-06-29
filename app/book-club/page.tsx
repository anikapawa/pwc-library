"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookCard from "@/components/BookCard";

export default function BookClubPage() {
  const [books, setBooks] = useState<any[]>([]);

  const currentBook = books.find(
    (book) => book.is_current_book_club_pick
  );

  const pastSelections = books.filter(
    (book) =>
      book.is_book_club_selection &&
      !book.is_current_book_club_pick
  );

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  /* ---------------- FETCH BOOKS ---------------- */
  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch("/api/books");
        if (!res.ok) {
          console.error("Failed to fetch books:", res.status);
          return;
        }

        const data = await res.json();
        setBooks(data || []);
      } catch (err) {
        console.error("Failed to load books:", err);
      }
    }

    loadBooks();
  }, []);

  /* ---------------- FORM SUBMIT ---------------- */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/book-club", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          name,
          email,
          reason,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send book club request");
      }

      setSubmitted(true);
      setTitle("");
      setAuthor("");
      setName("");
      setEmail("");
      setReason("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-white text-black">

      {/* HERO */}
      <section className="text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-4">
          PWC Book Club
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join fellow students in reading and discussing books that explore gender, identity, equity, leadership, and social change.
        </p>
      </section>

      {/* ABOUT */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-4">
          About the Book Club
        </h2>

        <p className="text-lg text-gray-700 leading-relaxed">
          The Penn Women&apos;s Center Book Club provides a space for students to engage in meaningful conversations, build community, and explore important social issues through literature. The club meets once a month to discuss the current selection and connect with fellow readers.
        </p>
      </section>

      {/* CURRENT SELECTION */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-6">
          Current Selection
        </h2>

        {currentBook && (
          <div className="border rounded-lg p-6 flex flex-col md:flex-row gap-8">

            {/* LEFT: COVER + BUTTON STACK */}
            <div className="flex flex-col items-center flex-shrink-0">
              {currentBook.cover_image ? (
                <img
                  src={currentBook.cover_image}
                  alt={currentBook.title}
                  className="w-[220px] h-[340px] object-contain bg-white rounded-lg shadow-sm"
                />
              ) : (
                <div className="w-[220px] h-[340px] bg-gray-200 rounded-lg" />
              )}

              {/* BUTTON DIRECTLY UNDER IMAGE */}
              <Link
                href={`/books/${currentBook.id}`}
                className="mt-4 w-[220px] text-center px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
                View Book Details
            </Link>
            </div>

            {/* RIGHT: INFO */}
            <div className="flex flex-col flex-1">
              <div>
                <h3 className="text-3xl font-bold mb-2">
                  {currentBook.title}
                </h3>

                <p className="text-lg text-gray-600 mb-6">
                  by {currentBook.author}
                </p>

                <div className="mb-6 space-y-1 text-gray-700">
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {currentBook.book_club_date || "Coming Soon"}
                  </p>

                  <p>
                    <span className="font-semibold">Time:</span>{" "}
                    {currentBook.book_club_time || "Coming Soon"}
                  </p>

                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {currentBook.book_club_location || "Coming Soon"}
                  </p>

                  <p>
                    <span className="font-semibold">Free Books Left:</span>{" "}
                    {currentBook.free_books_left ?? 0}
                  </p>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {currentBook.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* PAST SELECTIONS */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-6">
          Past Selections
        </h2>

        {/* FULL WIDTH GRID USING BOOKCARD */}
        <div className="flex flex-wrap gap-14">
            {pastSelections.map((book) => (
                <BookCard key={book.id} book={book} />
            ))}
        </div>
      </section>

      {/* RECOMMEND FORM */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Recommend a book for the book club!
        </h2>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 border rounded-lg p-6"
          >
            <input
              type="text"
              placeholder="Book Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-3 rounded"
              required
            />

            <input
              type="text"
              placeholder="Author *"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border p-3 rounded"
              required
            />

            <input
              type="text"
              placeholder="Your Name (Optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-3 rounded"
            />

            <input
              type="email"
              placeholder="Your Email (Optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded"
            />

            <textarea
              placeholder="Why are you recommending this book?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border p-3 rounded h-28"
            />

            <button
              type="submit"
              className="bg-black text-white px-5 py-3 rounded hover:bg-gray-800 transition cursor-pointer"
            >
              Submit Recommendation
            </button>
          </form>
        ) : (
          <div className="border rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">
              Thank you! 🎉
            </h3>

            <p className="text-gray-600">
              Your recommendation has been submitted.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}