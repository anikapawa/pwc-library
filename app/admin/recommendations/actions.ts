"use server";

import { updateRecommendationStatus } from "../../../lib/recommendations";
import { revalidatePath } from "next/cache";

export async function handleRecommendationAction(
  id: number,
  status: "Approved" | "Rejected"
) {
  await updateRecommendationStatus(id, status);

  // refresh UI instantly
  revalidatePath("/admin/recommendations");
}