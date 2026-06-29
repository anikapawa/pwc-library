"use client";

import Link from "next/link";
import BookCard from "../components/BookCard";
import { useEffect, useState } from "react";

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch("/api/books");

        if (!res.ok) {
          console.error("Failed to fetch books:", res.status);
          return;
        }

        const text = await res.text();
        if (!text) {
          console.error("Empty response from /api/books");
          return;
        }

        const data = JSON.parse(text);
        setBooks(data || []);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      }
    }

    loadBooks();
  }, []);

  const favoriteBooks = books.filter((book) => book.is_favorite);
  const historyMonthBooks = books.filter((book) => book.is_history_month);

  return (
    <main className="min-h-screen bg-white text-black">

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-5xl font-bold mb-4">
          Penn Women's Center Library
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Explore books and resources curated by the Penn Women&apos;s Center.
        </p>

        <Link
          href="/library"
          className="mt-8 px-6 py-3 bg-black text-white rounded-lg inline-block hover:bg-gray-800 transition active:scale-95"
        >
          Browse Library
        </Link>
      </section>

      {/* PWC FAVORITES */}
      <section className="px-10 py-12">
        <h2 className="text-3xl font-semibold mb-6">
          PWC Favorites
        </h2>

        <div className="overflow-x-auto w-full">
          <div className="flex w-max gap-4 p-2">
            {favoriteBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* HISTORY MONTH */}
      <section className="px-10 py-12">
        <h2 className="text-3xl font-semibold mb-6">
          History Month Highlights
        </h2>

        <div className="overflow-x-auto w-full">
          <div className="flex w-max gap-4 p-2">
            {historyMonthBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* BOOK CLUB */}
      <section className="px-10 py-10 text-center">
        <h2 className="text-3xl font-semibold mb-3">
          Book Club
        </h2>

        <p className="text-gray-600 text-lg mb-5 max-w-xl mx-auto">
          Monthly discussions hosted by the Penn Women&apos;s Center.
        </p>

        <Link
          href="/book-club"
          className="px-6 py-3 bg-black text-white rounded-lg inline-block hover:bg-gray-800 transition active:scale-95"
        >
          Learn More
        </Link>
      </section>

    </main>
  );
}