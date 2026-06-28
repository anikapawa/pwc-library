import { getRequests } from "../../../lib/requests";
import StatusBadge from "../../../components/StatusBadge";
import RequestActions from "./RequestActions";

export default async function RequestsAdminPage() {
  const requests = await getRequests();

  // --------------------------------------------------
  // CURRENTLY CHECKED OUT / ACTIVE BOOKS
  // --------------------------------------------------
  const currentCheckouts = requests.filter(
    (r) => r.status === "Approved"
  );

  const checkedOutBooks = new Set(
    currentCheckouts.map((r) => r.book)
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">

      {/* ========================================= */}
      {/* REQUESTS */}
      {/* ========================================= */}
      <h1 className="text-4xl font-bold mb-8">
        Requests
      </h1>

      <div className="border rounded-xl overflow-hidden mb-12">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Student</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Book</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => {
              const earlierPending = requests.find(
                (r) =>
                  r.book === request.book &&
                  r.status === "Pending" &&
                  r.id < request.id
              );

              const firstInQueue = !earlierPending;

              const waitingForReturn =
                request.status === "Pending" &&
                firstInQueue &&
                checkedOutBooks.has(request.book);

              const waitingForEarlierRequest =
                request.status === "Pending" &&
                !firstInQueue;

              const canApprove =
                request.status === "Pending" &&
                firstInQueue &&
                !checkedOutBooks.has(request.book);

              return (
                <tr key={request.id} className="border-t">
                  <td className="p-4">{request.student}</td>
                  <td className="p-4">{request.email}</td>
                  <td className="p-4">{request.book}</td>
                  <td className="p-4 capitalize">{request.type}</td>

                  <td className="p-4">
                    <StatusBadge status={request.status} />
                  </td>

                  <td className="p-4">
                    <RequestActions
                      request={request}
                      canApprove={canApprove}
                      waitingForReturn={waitingForReturn}
                      waitingForEarlierRequest={waitingForEarlierRequest}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ========================================= */}
      {/* CURRENT CHECKOUTS */}
      {/* ========================================= */}
      <h2 className="text-4xl font-bold mb-4">
        Current Checkouts
      </h2>

      <div className="border rounded-xl overflow-hidden mb-12">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Book</th>
              <th className="text-left p-4">Student</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentCheckouts.length === 0 ? (
              <tr>
                <td
                  className="p-4 text-gray-500"
                  colSpan={4}
                >
                  No active checkouts
                </td>
              </tr>
            ) : (
              currentCheckouts.map((request) => (
                <tr key={request.id} className="border-t">
                  <td className="p-4">{request.book}</td>
                  <td className="p-4">{request.student}</td>
                  <td className="p-4">{request.email}</td>
                  <td className="p-4">
                    <RequestActions request={request} />
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