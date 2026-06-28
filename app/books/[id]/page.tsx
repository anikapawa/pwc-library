import { getBookById } from "@/lib/books.server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const book = await getBookById(Number(id));

  if (!book) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold">
          Book Not Found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black p-10">
      <div className="max-w-4xl mx-auto">

        {/* COVER IMAGE (TALLER) */}
        {book.cover_image ? (
          <img
            src={book.cover_image}
            alt={book.title}
            className="
              w-64
              h-[420px]
              object-cover
              rounded-lg
              mb-8
              shadow-md
            "
          />
        ) : (
          <div
            className="
              w-64
              h-[420px]
              bg-gray-300
              rounded-lg
              mb-8
            "
          />
        )}

        {/* BOOK INFO */}
        <h1 className="text-4xl font-bold mb-4">
          {book.title}
        </h1>

        <p className="text-lg mb-2">
          <strong>Author:</strong> {book.author}
        </p>

        <p className="text-lg mb-2">
          <strong>Genre:</strong> {book.genre}
        </p>

        <p className="text-lg mb-8">
          <strong>Status:</strong> {book.status}
        </p>

        {/* DESCRIPTION */}
        <h2 className="text-2xl font-semibold mb-2">
          Description
        </h2>

        <p className="mb-8">
          {book.description}
        </p>

        {/* GENDER EQUITY */}
        <h2 className="text-2xl font-semibold mb-2">
          Connection to Gender Equity
        </h2>

        <p className="mb-8">
          {book.gender_equity_connection}
        </p>

        {/* ACTIONS */}
        <div className="flex gap-4">
          <a
            href={book.goodreads_link}
            target="_blank"
            rel="noopener noreferrer"
            className="
              px-6
              py-3
              bg-black
              text-white
              rounded-lg
              hover:bg-gray-800
              transition
            "
          >
            View on Goodreads
          </a>

          <a
            href={`/request/${book.id}`}
            className="
              px-6
              py-3
              border
              rounded-lg
              cursor-pointer
              hover:bg-gray-100
              transition
            "
          >
            {book.status === "Available"
              ? "Request Checkout"
              : "Join Hold List"}
          </a>
        </div>

      </div>
    </main>
  );
}