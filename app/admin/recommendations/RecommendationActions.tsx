"use client";

import { useTransition } from "react";
import { handleRecommendationAction } from "./actions";

export default function RecommendationActions({
  rec,
}: {
  rec: any;
}) {
  const [pending, startTransition] = useTransition();

  const handleClick = (status: "Approved" | "Rejected") => {
    startTransition(async () => {
      await handleRecommendationAction(rec.id, status);
    });
  };

  if (rec.status !== "Pending") {
    return (
      <span className="text-gray-500 text-sm">
        {rec.status}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleClick("Approved")}
        className="cursor-pointer bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
      >
        Approve
      </button>

      <button
        onClick={() => handleClick("Rejected")}
        className="cursor-pointer bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
      >
        Reject
      </button>
    </div>
  );
}