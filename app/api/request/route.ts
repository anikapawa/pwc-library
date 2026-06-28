import { Resend } from "resend";
import { supabaseServer } from "@/lib/supabase-server";

const resend = new Resend(
  process.env.RESEND_API_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      type,
      title,
      author,
      name,
      email,
    } = body;

    // SAVE TO REQUESTS TABLE

    const { error } = await supabaseServer
      .from("requests")
      .insert([
        {
          student: name,
          email,
          book: title,
          type,
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
            "Failed to save request",
        },
        {
          status: 500,
        }
      );
    }

    // SEND EMAIL

    const isCheckout =
      type === "checkout";

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "anikapawa25@gmail.com",
      subject: isCheckout
        ? `Checkout Request: ${title}`
        : `Hold Request: ${title}`,
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
            ${
              isCheckout
                ? "Checkout Request"
                : "Hold Request"
            }
          </h2>

          <p>
            <strong>Title:</strong>
            ${title}
          </p>

          <p>
            <strong>Author:</strong>
            ${author}
          </p>

          <hr />

          <p>
            <strong>Name:</strong>
            ${name}
          </p>

          <p>
            <strong>Email:</strong>
            ${email}
          </p>
        </div>
      `,
    });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          "Failed to submit request",
      },
      {
        status: 500,
      }
    );
  }
}