import Link from "next/link";
import { getBooks } from "@/lib/books.server";
import DeleteBookButton from "@/components/DeleteBookButton";

export default async function BooksAdminPage() {
  const books = await getBooks();

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          Books
        </h1>

        <Link
          href="/admin/books/new"
          className="
            px-4
            py-2
            bg-black
            text-white
            rounded-lg
            hover:bg-gray-800
            transition
            cursor-pointer
          "
        >
          Add Book
        </Link>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">
                Cover
              </th>

              <th className="text-left p-4">
                Title
              </th>

              <th className="text-left p-4">
                Author
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {books.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-gray-500"
                >
                  No books found.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr
                  key={book.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {book.cover_image ? (
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="
                          w-14
                          h-20
                          object-cover
                          rounded
                        "
                      />
                    ) : (
                      <div
                        className="
                          w-14
                          h-20
                          bg-gray-200
                          rounded
                        "
                      />
                    )}
                  </td>

                  <td className="p-4 font-medium">
                    {book.title}
                  </td>

                  <td className="p-4">
                    {book.author}
                  </td>

                  <td className="p-4">
                    {book.status}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/books/${book.id}`}
                        className="
                          px-3
                          py-1
                          bg-blue-600
                          text-white
                          rounded
                          hover:bg-blue-700
                          transition
                          cursor-pointer
                        "
                      >
                        Edit
                      </Link>

                      <DeleteBookButton
                        id={book.id}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}