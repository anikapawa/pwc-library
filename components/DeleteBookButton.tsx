"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteBookButton({
  id,
}: {
  id: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const deleteBook = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await fetch(`/api/admin/books/${id}`, {
        method: "DELETE",
      });

      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={deleteBook}
      disabled={loading}
      className="
        px-3
        py-1
        bg-red-600
        text-white
        rounded
        hover:bg-red-700
        transition
        cursor-pointer
        disabled:opacity-50
      "
    >
      Delete
    </button>
  );
}