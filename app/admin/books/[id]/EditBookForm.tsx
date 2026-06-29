"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const GENRES = [
  "Fiction",
  "Nonfiction",
  "Historical",
  "Memoir",
  "Biography",
  "Personal Development",
  "Essays & Journalism",
];

export default function EditBookForm({
  book,
}: {
  book: any;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: book.title ?? "",
    author: book.author ?? "",
    genre: book.genre ?? "",
    status: book.status ?? "Available",
    goodreads_link: book.goodreads_link ?? "",
    cover_image: book.cover_image ?? "",
    description: book.description ?? "",
    gender_equity_connection:
      book.gender_equity_connection ?? "",

    book_club_date: book.book_club_date ?? "",
    book_club_time: book.book_club_time ?? "",
    book_club_location:
      book.book_club_location ?? "",
    free_books_left:
      book.free_books_left ?? 0,

    is_favorite: book.is_favorite ?? false,
    is_history_month:
      book.is_history_month ?? false,
    is_current_book_club_pick:
      book.is_current_book_club_pick ??
      false,
    is_book_club_selection:
      book.is_book_club_selection ??
      false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value, type } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (
              e.target as HTMLInputElement
            ).checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        `/api/admin/books/${book.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update book"
        );
      }

      router.push("/admin/books");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">
        Edit Book
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
                {/* TITLE */}
        <div>
          <label className="block font-medium mb-2">
            Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* AUTHOR */}
        <div>
          <label className="block font-medium mb-2">
            Author
          </label>

          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* GENRE */}
        <div>
          <label className="block font-medium mb-2">
            Genre
          </label>

          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* COVER IMAGE */}
        <div>
          <label className="block font-medium mb-2">
            Cover Image URL
          </label>

          <input
            type="text"
            name="cover_image"
            value={formData.cover_image}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* GOODREADS */}
        <div>
          <label className="block font-medium mb-2">
            Goodreads Link
          </label>

          <input
            type="text"
            name="goodreads_link"
            value={formData.goodreads_link}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* STATUS */}
        <div>
          <label className="block font-medium mb-2">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="Available">
              Available
            </option>

            <option value="Checked Out">
              Checked Out
            </option>
          </select>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block font-medium mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* GENDER EQUITY */}
        <div>
          <label className="block font-medium mb-2">
            Gender Equity Connection
          </label>

          <textarea
            name="gender_equity_connection"
            value={formData.gender_equity_connection}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* CHECKBOXES */}
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_favorite"
              checked={formData.is_favorite}
              onChange={handleChange}
            />
            PWC Favorite
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_history_month"
              checked={formData.is_history_month}
              onChange={handleChange}
            />
            History Month Book
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_current_book_club_pick"
              checked={formData.is_current_book_club_pick}
              onChange={handleChange}
            />
            Current Book Club Pick
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_book_club_selection"
              checked={formData.is_book_club_selection}
              onChange={handleChange}
            />
            Past Book Club Selection
          </label>
        </div>

        {/* BOOK CLUB INFO */}
        {formData.is_current_book_club_pick && (
          <div className="space-y-4 border rounded-lg p-4">
            <h2 className="text-xl font-semibold">
              Book Club Meeting Information
            </h2>

            <div>
              <label className="block font-medium mb-2">
                Date
              </label>

              <input
                type="text"
                name="book_club_date"
                value={formData.book_club_date}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Time
              </label>

              <input
                type="text"
                name="book_club_time"
                value={formData.book_club_time}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Location
              </label>

              <input
                type="text"
                name="book_club_location"
                value={formData.book_club_location}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Free Books Left
              </label>

              <input
                type="number"
                name="free_books_left"
                value={formData.free_books_left}
                onChange={handleChange}
                min={0}
                className="w-full border rounded-lg p-3"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}