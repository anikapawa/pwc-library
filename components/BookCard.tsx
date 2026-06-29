import Link from "next/link";

type Book = {
  id: number;
  title: string;
  author: string;
  status: "Available" | "Checked Out" | string;
  cover_image?: string | null;
};

export default function BookCard({
  book,
}: {
  book: Book;
}) {
  const statusStyles =
    book.status === "Available"
      ? "bg-green-100 text-green-700"
      : book.status === "Checked Out"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <Link href={`/books/${book.id}`}>
      <div
        className="
          w-[200px]
          bg-white
          border
          rounded-lg
          p-3
          shadow-sm
          flex
          flex-col
          hover:shadow-lg
          hover:-translate-y-1
          transition
          cursor-pointer
        "
      >
        {/* Cover Image */}
        {book.cover_image ? (
          <img
            src={book.cover_image}
            alt={book.title}
            className="
              w-full
              aspect-[2/3]
              object-cover
              rounded
              mb-3
            "
          />
        ) : (
          <div
            className="
              w-full
              aspect-[2/3]
              bg-gray-200
              rounded
              mb-3
            "
          />
        )}

        {/* Book Info */}
        <div className="flex-grow flex flex-col">
          {/* Title (2-line max space reserved) */}
          <h3
            className="
              text-sm
              font-semibold
              leading-5
              min-h-[2.5rem]
              overflow-hidden
            "
          >
            {book.title}
          </h3>

          {/* Author (single line, truncates) */}
          <p
            className="
              text-xs
              text-gray-500
              leading-4
              truncate
              mt-1
            "
          >
            {book.author}
          </p>
        </div>

        {/* Status Badge */}
        <span
          className={`
            text-xs
            mt-3
            px-2
            py-1
            rounded
            w-fit
            ${statusStyles}
          `}
        >
          {book.status}
        </span>
      </div>
    </Link>
  );
}