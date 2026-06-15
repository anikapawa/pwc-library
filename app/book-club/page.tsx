"use client";

import { useState } from "react";
import { books } from "../../data/books";

export default function BookClubPage() {
  const currentBook = books.find(
    (book) => book.isCurrentBookClubPick
  );

  const pastSelections = books.filter(
    (book) =>
      book.isBookClubSelection &&
      !book.isCurrentBookClubPick
  );

  // FORM STATE
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
          The Penn Women&apos;s Center Book Club provides a space for students to engage in meaningful conversations, build community, and explore important social issues through literature.
        </p>
      </section>

      {/* CURRENT SELECTION */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-6">
          Current Selection
        </h2>

        {currentBook && (
          <div className="border rounded-lg p-6 flex flex-col md:flex-row gap-6">

            <div className="w-[220px] h-[320px] bg-gray-200 rounded" />

            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-2">
                  {currentBook.title}
                </h3>

                <p className="text-lg text-gray-600 mb-6">
                  by {currentBook.author}
                </p>

                <p className="text-gray-700 mb-6">
                  {currentBook.description}
                </p>
              </div>

              <a
                href={`/books/${currentBook.id}`}
                className="mt-6 inline-block w-fit px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                View Book Details
              </a>
            </div>
          </div>
        )}
      </section>

      {/* PAST SELECTIONS */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-6">
          Past Selections
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {pastSelections.map((book) => (
            <div key={book.id} className="border rounded-lg p-4">
              <div className="w-full h-[180px] bg-gray-200 rounded mb-3" />

              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-gray-600 text-sm">{book.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RECOMMEND FORM */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold mb-6">
          Recommend a book for the book club!
        </h2>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 border rounded-lg p-6"
          >
            {/* TITLE */}
            <input
              type="text"
              placeholder="Book Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-3 rounded"
              required
            />

            {/* AUTHOR */}
            <input
              type="text"
              placeholder="Author *"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full border p-3 rounded"
              required
            />

            {/* NAME (optional) */}
            <input
              type="text"
              placeholder="Your Name (Optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-3 rounded"
            />

            {/* EMAIL (optional) */}
            <input
              type="email"
              placeholder="Your Email (Optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded"
            />

            {/* REASON */}
            <textarea
              placeholder="Why are you recommending this book? (Optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border p-3 rounded h-28"
            />

            <button
              type="submit"
              className="bg-black text-white px-5 py-3 rounded hover:bg-gray-800 transition active:scale-95"
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