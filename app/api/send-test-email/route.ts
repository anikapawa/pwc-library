import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "anikapawa25@gmail.com",
      subject: "PWC Library Email Test",
      html: `
        <h1>Email Integration Works! 🎉</h1>
        <p>This email was sent from your PWC Library project.</p>
      `,
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}