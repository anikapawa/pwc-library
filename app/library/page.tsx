"use client";

import { useEffect, useState } from "react";
import BookCard from "../../components/BookCard";

export default function LibraryPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    async function loadBooks() {
      const res = await fetch("/api/books");
      const data = await res.json();

      setBooks(data);
    }

    loadBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      book.author
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesGenre =
      selectedGenre === "All" ||
      book.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  return (
    <main className="min-h-screen bg-white text-black px-10 py-10">

      <h1 className="text-4xl font-bold mb-6">
        Library Catalog
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="border rounded-lg px-4 py-2 w-full md:max-w-md"
        />

        <select
          value={selectedGenre}
          onChange={(e) =>
            setSelectedGenre(e.target.value)
          }
          className="border rounded-lg px-4 py-2"
        >
          <option value="All">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Nonfiction">Nonfiction</option>
          <option value="Historical">Historical</option>
          <option value="Memoir">Memoir</option>
          <option value="Biography">Biography</option>
          <option value="Personal Development">
            Personal Development
          </option>
          <option value="Essays & Journalism">
            Essays & Journalism
          </option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
          />
        ))}
      </div>
    </main>
  );
}