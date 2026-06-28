"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RequestActions({
  request,
  canApprove = true,
  waitingForReturn = false,
  waitingForEarlierRequest = false,
}: {
  request: any;
  canApprove?: boolean;
  waitingForReturn?: boolean;
  waitingForEarlierRequest?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (
    status: "Approved" | "Rejected" | "Returned"
  ) => {
    try {
      setLoading(true);

      await fetch("/api/admin/request-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: request.id,
          status,
        }),
      });

      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const archiveRequest = async () => {
    try {
      setLoading(true);

      await fetch("/api/admin/request-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: request.id,
          action: "archive",
        }),
      });

      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // FINAL STATES
  // -----------------------------
  if (request.status === "Returned") {
    return (
      <div className="flex gap-2 items-center">
        <button
          onClick={archiveRequest}
          disabled={loading}
          className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:opacity-50 cursor-pointer"
        >
          Archive
        </button>
      </div>
    );
  }

  if (request.status === "Rejected") {
    return (
      <div className="flex gap-2 items-center">
        <button
          onClick={archiveRequest}
          disabled={loading}
          className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:opacity-50 cursor-pointer"
        >
          Archive
        </button>
      </div>
    );
  }

  // -----------------------------
  // BLOCKED STATES (QUEUE LOGIC)
  // -----------------------------
  if (waitingForReturn) {
    return (
      <span className="text-gray-600 text-sm font-medium">
        Waiting for book to be returned
      </span>
    );
  }

  if (waitingForEarlierRequest) {
    return (
      <span className="text-gray-600 text-sm font-medium">
        Waiting for earlier request
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      {/* APPROVE / REJECT */}
      {request.status === "Pending" && canApprove && (
        <>
          <button
            onClick={() => updateStatus("Approved")}
            disabled={loading}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 cursor-pointer"
          >
            Approve
          </button>

          <button
            onClick={() => updateStatus("Rejected")}
            disabled={loading}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 cursor-pointer"
          >
            Reject
          </button>
        </>
      )}

      {/* RETURN */}
      {request.status === "Approved" && (
        <button
          onClick={() => updateStatus("Returned")}
          disabled={loading}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          Mark Returned
        </button>
      )}
    </div>
  );
}
