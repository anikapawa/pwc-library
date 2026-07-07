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
      genre,
      reason,
      name,
      email,
    } = body;

    // ---------------------------
    // SAVE TO RECOMMENDATIONS TABLE
    // ---------------------------

    const { error } = await supabaseServer
      .from("recommendations")
      .insert([
        {
          title,
          author,
          type: "New Book",
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

    // ---------------------------
    // SEND EMAIL TO PWC
    // ---------------------------

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "anikapawa25@gmail.com", // Replace with PWC email later
      subject: `New PWC Book Recommendation: ${title}`,
      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            font-size: 18px;
            line-height: 1.6;
            max-width: 600px;
          "
        >
          <h2>New PWC Book Recommendation</h2>

          <p>
            <strong>Title:</strong>
            ${title}
          </p>

          <p>
            <strong>Author:</strong>
            ${author}
          </p>

          <p>
            <strong>Genre:</strong>
            ${genre || "Not Provided"}
          </p>

          <hr />

          <p>
            <strong>Submitted By:</strong>
            ${name || "Anonymous"}
          </p>

          <p>
            <strong>Email:</strong>
            ${email || "Not Provided"}
          </p>

          <hr />

          <p>
            <strong>Reason:</strong>
          </p>

          <p>
            ${reason || "No reason provided."}
          </p>
        </div>
      `,
    });

    // ---------------------------
    // SEND CONFIRMATION TO USER
    // ---------------------------

    if (email?.trim()) {
      const greeting = name?.trim()
        ? `Hello ${name},`
        : "Hello,";

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject:
          "PWC Library Recommendation Confirmation",
        html: `
          <div style="font-family: Arial, sans-serif; max-width:600px; line-height:1.6;">

            <p>${greeting}</p>

            <p>
              Thank you for recommending a book for the Penn Women's Center Library!
              Your recommendation has been successfully received.
            </p>

            <hr />

            <p><strong>Title:</strong> ${title}</p>

            <p><strong>Author:</strong> ${author}</p>

            <p><strong>Genre:</strong> ${genre || "Not Provided"}</p>

            ${
              reason?.trim()
                ? `
            <p><strong>Your Reason:</strong></p>

            <p>${reason}</p>
            `
                : ""
            }

            <hr />

            <p>
              Our team reviews every recommendation before deciding whether to add it to the library collection.
            </p>

            <p>
              Thank you for helping us grow the PWC Library!
            </p>

          </div>
        `,
      });
    }

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          "Failed to submit recommendation",
      },
      {
        status: 500,
      }
    );
  }
}