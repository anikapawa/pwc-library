import { books } from "../../../data/books";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookRequestPage({
  params,
}: Props) {
  // ✅ FIX: properly unwrap promise params
  const { id } = await params;

  const book = books.find(
    (b) => b.id === Number(id)
  );

  if (!book) {
    return (
      <main className="p-10">
        <h1>Book not found.</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black px-6 py-12">
      <div className="max-w-2xl mx-auto">

        {/* TITLE */}
        <h1 className="text-4xl font-bold mb-4">
          {book.status === "Available"
            ? "Request Checkout"
            : "Join Hold List"}
        </h1>

        {/* SUBTITLE */}
        <p className="text-gray-600 mb-8">
          {book.title} by {book.author}
        </p>

        {/* FORM */}
        <form
          action="/api/request"
          method="POST"
          className="space-y-4 border rounded-lg p-6"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full border p-3 rounded hover:border-black transition"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Penn Email"
            className="w-full border p-3 rounded hover:border-black transition"
            required
          />

          {/* hidden fields so API knows book info */}
          <input type="hidden" name="title" value={book.title} />
          <input type="hidden" name="author" value={book.author} />
          <input
            type="hidden"
            name="type"
            value={
              book.status === "Available"
                ? "checkout"
                : "hold"
            }
          />

          <button
            type="submit"
            className="
              bg-black
              text-white
              px-5
              py-3
              rounded
              hover:bg-gray-800
              hover:scale-[1.02]
              active:scale-95
              transition
              w-full
            "
          >
            Submit Request
          </button>
        </form>

      </div>
    </main>
  );
}