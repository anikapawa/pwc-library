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

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      title: book.title ?? "",
      author: book.author ?? "",
      genre: book.genre ?? "",
      status: book.status ?? "Available",
      goodreads_link:
        book.goodreads_link ?? "",
      cover_image:
        book.cover_image ?? "",
      description:
        book.description ?? "",
      gender_equity_connection:
        book.gender_equity_connection ??
        "",

      book_club_date:
        book.book_club_date ?? "",

      book_club_time:
        book.book_club_time ?? "",

      book_club_location:
        book.book_club_location ?? "",

      is_favorite:
        book.is_favorite ?? false,

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
    const {
      name,
      value,
      type,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (
              e.target as HTMLInputElement
            ).checked
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
          body: JSON.stringify(
            formData
          ),
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

      alert(
        "Failed to update book."
      );
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
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        {/* AUTHOR */}
        <input
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        {/* GENRE */}
        <select
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        >
          {GENRES.map((g) => (
            <option
              key={g}
              value={g}
            >
              {g}
            </option>
          ))}
        </select>

        {/* COVER */}
        <input
          name="cover_image"
          value={formData.cover_image}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        {/* GOODREADS */}
        <input
          name="goodreads_link"
          value={
            formData.goodreads_link
          }
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        {/* STATUS */}
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

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={
            formData.description
          }
          onChange={handleChange}
          rows={5}
          className="w-full border rounded-lg p-3"
        />

        {/* GENDER EQUITY */}
        <textarea
          name="gender_equity_connection"
          value={
            formData.gender_equity_connection
          }
          onChange={handleChange}
          rows={4}
          className="w-full border rounded-lg p-3"
        />

        <div className="space-y-3">
          <label className="flex gap-3">
            <input
              type="checkbox"
              name="is_favorite"
              checked={
                formData.is_favorite
              }
              onChange={handleChange}
            />
            PWC Favorite
          </label>

          <label className="flex gap-3">
            <input
              type="checkbox"
              name="is_history_month"
              checked={
                formData.is_history_month
              }
              onChange={handleChange}
            />
            History Month Book
          </label>

          <label className="flex gap-3">
            <input
              type="checkbox"
              name="is_current_book_club_pick"
              checked={
                formData.is_current_book_club_pick
              }
              onChange={handleChange}
            />
            Current Book Club Pick
          </label>

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
                placeholder="October 15, 2026"
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
                placeholder="6:00 PM"
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
                placeholder="PWC Lounge"
                className="w-full border rounded-lg p-3"
              />
            </div>
          </div>
        )}

          <label className="flex gap-3">
            <input
              type="checkbox"
              name="is_book_club_selection"
              checked={
                formData.is_book_club_selection
              }
              onChange={handleChange}
            />
            Past Book Club Selection
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </button>
      </form>
    </main>
  );
}