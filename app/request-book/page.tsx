"use client";

import { useState } from "react";

export default function RequestBookPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      const response = await fetch(
        "/api/request-book",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title,
            author,
            genre,
            name,
            email,
            reason,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to send request"
        );
      }

      setSubmitted(true);

      setTitle("");
      setAuthor("");
      setGenre("");
      setName("");
      setEmail("");
      setReason("");
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong. Please try again."
      );
    }
  }

  return (
    <main className="min-h-screen bg-white text-black px-6 py-12">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-5xl font-bold mb-4">
          Request a Book
        </h1>

        <p className="text-lg text-gray-600 mb-10 max-w-2xl">
          Is there a book you'd like to see added to the Penn Women's Center Library?
          Submit a recommendation below!
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 border rounded-lg p-6"
          >
            <input
              type="text"
              placeholder="Book Title *"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full border p-3 rounded"
              required
            />

            <input
              type="text"
              placeholder="Author *"
              value={author}
              onChange={(e) =>
                setAuthor(e.target.value)
              }
              className="w-full border p-3 rounded"
              required
            />

            <select
              value={genre}
              onChange={(e) =>
                setGenre(e.target.value)
              }
              className="w-full border p-3 rounded"
            >
              <option value="">
                Select a Genre (Optional)
              </option>

              <option value="Fiction">
                Fiction
              </option>

              <option value="Nonfiction">
                Nonfiction
              </option>

              <option value="Historical">
                Historical
              </option>

              <option value="Memoir">
                Memoir
              </option>

              <option value="Biography">
                Biography
              </option>

              <option value="Personal Development">
                Personal Development
              </option>

              <option value="Essays & Journalism">
                Essays & Journalism
              </option>
            </select>

            <input
              type="text"
              placeholder="Your Name (Optional)"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border p-3 rounded"
            />

            <input
              type="email"
              placeholder="Penn Email (Optional)"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border p-3 rounded"
            />

            <textarea
              placeholder="Why are you recommending this book? (Optional)"
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              className="w-full border p-3 rounded h-32"
            />

            <button
              type="submit"
              className="
                bg-black
                text-white
                px-5
                py-3
                rounded
                cursor-pointer
                hover:bg-gray-800
                active:scale-95
                transition
              "
            >
              Submit Request
            </button>
          </form>
        ) : (
          <div className="border rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-3">
              Thank You! 🎉
            </h2>

            <p className="text-gray-600">
              Your book recommendation has been submitted for consideration.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}