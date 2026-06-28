import { getRecommendations } from "../../../lib/recommendations";
import StatusBadge from "../../../components/StatusBadge";
import RecommendationActions from "./RecommendationActions";

export default async function RecommendationsAdminPage() {
  const recommendations = await getRecommendations();

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">
        Recommendations
      </h1>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Author</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Submitted By</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {recommendations.map((rec) => (
              <tr key={rec.id} className="border-t">
                <td className="p-4">{rec.title}</td>
                <td className="p-4">{rec.author}</td>
                <td className="p-4 capitalize">{rec.type}</td>
                <td className="p-4">{rec.submitted_by}</td>

                <td className="p-4">
                  <StatusBadge status={rec.status} />
                </td>

                <td className="p-4">
                  <RecommendationActions rec={rec} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}