import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "anikapawa25@gmail.com",
      subject: `New PWC Book Request: ${title}`,
      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            font-size: 18px;
            line-height: 1.6;
            max-width: 600px;
          "
        >
          <h2>📚 New PWC Book Request</h2>

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
            <strong>Penn Email:</strong>
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

    return Response.json(data);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}