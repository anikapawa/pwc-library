import Link from "next/link";

type Book = {
  id: number;
  title: string;
  author: string;
  status: string;
};

export default function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/books/${book.id}`}>
      <div className="w-[200px] h-[260px] bg-white border rounded-lg p-3 shadow-sm flex flex-col justify-between hover:shadow-lg transition cursor-pointer">

        {/* Cover Placeholder */}
        <div className="h-[140px] bg-gray-200 rounded mb-3" />

        {/* Book Info */}
        <div>
          <h3 className="text-sm font-semibold">
            {book.title}
          </h3>

          <p className="text-xs text-gray-500">
            {book.author}
          </p>
        </div>

        {/* Status Badge */}
        <span
          className={`text-xs mt-2 px-2 py-1 rounded w-fit ${
            book.status === "Available"
              ? "bg-green-100 text-green-700"
              : book.status === "Checked Out"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {book.status}
        </span>

      </div>
    </Link>
  );
}