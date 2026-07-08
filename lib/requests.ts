import { supabaseServer } from "./supabase-server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

/* ---------------- GET REQUESTS ---------------- */

export async function getRequests() {
  const { data, error } = await supabaseServer
    .from("requests")
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getRequests error:", error);
    return [];
  }

  return data;
}

/* ---------------- UPDATE REQUEST STATUS ---------------- */

export async function updateRequestStatus(
  id: number,
  status: "Approved" | "Rejected" | "Returned"
) {
  // 1. Update request status
  const { data, error } = await supabaseServer
    .from("requests")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateRequestStatus error:", error);
    return null;
  }

  const bookTitle = data.book;

  // 2. APPROVED → book becomes Checked Out
  if (status === "Approved") {
    const { error: bookError } = await supabaseServer
      .from("books")
      .update({ status: "Checked Out" })
      .eq("title", bookTitle);

    if (bookError) {
      console.error("book status update error:", bookError);
    }
  }

  // 3. RETURNED → book becomes Available
  if (status === "Returned") {
    const { error: bookError } = await supabaseServer
      .from("books")
      .update({ status: "Available" })
      .eq("title", bookTitle);

    if (bookError) {
      console.error("book return update error:", bookError);
    }
  }

  /* ---------------- SEND EMAIL ---------------- */

  if (
    (status === "Approved" || status === "Rejected") &&
    data.email
  ) {
    const firstName = data.student?.trim()
      ? data.student.trim().split(" ")[0]
      : "";

    const greeting = firstName
      ? `Hello ${firstName},`
      : "Hello,";

    const isCheckout = data.type === "checkout";

    const subject =
      status === "Approved"
        ? isCheckout
          ? "Your PWC Library Checkout Request Has Been Approved"
          : "Your PWC Library Hold Request Has Been Approved"
        : isCheckout
        ? "Update on Your PWC Library Checkout Request"
        : "Update on Your PWC Library Hold Request";

    const body =
      status === "Approved"
        ? `
          <p>${greeting}</p>

          <p>
            Great news! Your ${
              isCheckout ? "checkout" : "hold"
            } request for <strong>${bookTitle}</strong> has been approved.
          </p>

          <p>
            Your book is now ready for pickup at the Penn Women's Center.
          </p>

          <p>
            We hope you enjoy reading it!
          </p>
        `
        : `
          <p>${greeting}</p>

          <p>
            Thank you for submitting a ${
              isCheckout ? "checkout" : "hold"
            } request for <strong>${bookTitle}</strong>.
          </p>

          <p>
            Unfortunately, we aren't able to approve your request at this time.
          </p>

          <p>
            If you have any questions, please feel free to contact the Penn Women's Center.
          </p>
        `;

    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: data.email,
        subject,
        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              line-height: 1.6;
            "
          >
            ${body}
          </div>
        `,
      });
    } catch (emailError) {
      console.error(
        "Failed to send request status email:",
        emailError
      );
    }
  }

  return data;
}

/* ---------------- ARCHIVE REQUEST ---------------- */

export async function archiveRequest(id: number) {
  const { error } = await supabaseServer
    .from("requests")
    .update({ archived: true })
    .eq("id", id);

  if (error) {
    console.error("archiveRequest error:", error);
    return false;
  }

  return true;
}