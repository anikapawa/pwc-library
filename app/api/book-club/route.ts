import { Resend } from "resend";
import { supabaseServer } from "@/lib/supabase-server";

const resend = new Resend(
  process.env.RESEND_API_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      author,
      reason,
      name,
      email,
    } = body;

    // SAVE TO RECOMMENDATIONS TABLE

    const { error } = await supabaseServer
      .from("recommendations")
      .insert([
        {
          title,
          author,
          type: "Book Club",
          submitted_by:
            name?.trim() || "Anonymous",
          status: "Pending",
        },
      ]);

    if (error) {
      console.error(
        "Supabase insert error:",
        error
      );

      return Response.json(
        {
          error:
            "Failed to save recommendation",
        },
        {
          status: 500,
        }
      );
    }

    // SEND EMAIL

    const data =
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "anikapawa25@gmail.com",
        subject: `New Book Club Recommendation: ${title}`,
        html: `
          <div
            style="
              font-family: Arial, sans-serif;
              font-size: 18px;
              line-height: 1.6;
              max-width: 600px;
            "
          >
            <h2>
              New Book Club Recommendation
            </h2>

            <p>
              <strong>Title:</strong>
              ${title}
            </p>

            <p>
              <strong>Author:</strong>
              ${author}
            </p>

            <p>
              <strong>Name:</strong>
              ${name || "Anonymous"}
            </p>

            <p>
              <strong>Email:</strong>
              ${email || "Not provided"}
            </p>

            <p>
              <strong>Reason:</strong>
            </p>

            <p>
              ${
                reason ||
                "No reason provided."
              }
            </p>
          </div>
        `,
      });

    return Response.json(data);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          "Failed to send email",
      },
      {
        status: 500,
      }
    );
  }
}