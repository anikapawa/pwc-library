"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RequestPage() {
  const params = useParams();

  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const [book, setBook] = useState<any>(null);
  const [loadingBook, setLoadingBook] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // FIX: use /api/books ONLY
  // -----------------------------
  useEffect(() => {
    async function loadBook() {
      if (!id) return;

      try {
        setLoadingBook(true);

        const res = await fetch("/api/books");

        if (!res.ok) {
          console.error("Failed to fetch books:", res.status);
          return;
        }

        const data = await res.json();

        // FIND BOOK BY ID LOCALLY
        const foundBook = data.find(
          (b: any) => String(b.id) === String(id)
        );

        setBook(foundBook || null);
      } catch (err) {
        console.error("Error loading book:", err);
      } finally {
        setLoadingBook(false);
      }
    }

    loadBook();
  }, [id]);

  // -----------------------------
  // LOADING STATE (unchanged UI)
  // -----------------------------
  if (loadingBook) {
    return (
      <main className="p-10">
        <h1>Loading...</h1>
      </main>
    );
  }

  // -----------------------------
  // NOT FOUND STATE (unchanged UI)
  // -----------------------------
  if (!book) {
    return (
      <main className="p-10">
        <h1>Book not found.</h1>
      </main>
    );
  }

  // -----------------------------
  // FORM SUBMIT (unchanged logic)
  // -----------------------------
  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type:
            book.status === "Available"
              ? "checkout"
              : "hold",
          title: book.title,
          author: book.author,
          name,
          email,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed request");
      }

      setSubmitted(true);
      setName("");
      setEmail("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-black px-6 py-12">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-4">
          {book.status === "Available"
            ? "Request Checkout"
            : "Join Hold List"}
        </h1>

        <p className="text-gray-600 mb-8">
          {book.title} by {book.author}
        </p>

        {/* FORM */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 border rounded-lg p-6"
          >
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border p-3 rounded"
              required
            />

            <input
              type="email"
              placeholder="Penn Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border p-3 rounded"
              required
            />

            <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-5 py-3 rounded w-full hover:bg-gray-800 transition cursor-pointer disabled:cursor-not-allowed"
            >
            {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        ) : (
          <div className="border p-6 text-center rounded-lg">
            <h2 className="text-2xl font-semibold">
              Thank you! 🎉
            </h2>
            <p>
              Your request has been received.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}