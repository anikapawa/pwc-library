import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json(); // <-- THIS is where errors usually happen

    const {
      type,
      title,
      author,
      name,
      email,
    } = body;

    const isCheckout = type === "checkout";

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "anikapawa25@gmail.com",
      subject: isCheckout
        ? `📚 Checkout Request: ${title}`
        : `📌 Hold Request: ${title}`,
      html: `
        <div style="font-family: Arial; font-size: 16px; line-height: 1.6;">
          <h2>${isCheckout ? "Checkout Request" : "Hold Request"}</h2>

          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Author:</strong> ${author}</p>

          <hr />

          <p><strong>Name:</strong> ${name || "Anonymous"}</p>
          <p><strong>Email:</strong> ${email || "Not provided"}</p>
        </div>
      `,
    });

    return Response.json(data);
  } catch (error) {
    console.error("API ERROR:", error);

    return Response.json(
      { error: "Failed to send request" },
      { status: 500 }
    );
  }
}