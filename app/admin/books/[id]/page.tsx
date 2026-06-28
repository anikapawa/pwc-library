import { getBookById } from "@/lib/books.server";
import EditBookForm from "./EditBookForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBookPage({
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
    <EditBookForm book={book} />
  );
}