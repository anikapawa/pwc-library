import { supabaseServer } from "@/lib/supabase-server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      book_id,
      name,
      email,
    } = body;

    // Prevent duplicate RSVPs
    const { data: existing } = await supabaseServer
      .from("book_club_rsvps")
      .select("id")
      .eq("book_id", book_id)
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return Response.json(
        {
          error:
            "You have already RSVP'd for this book club event.",
        },
        {
          status: 400,
        }
      );
    }

    // Save RSVP
    const { error } = await supabaseServer
      .from("book_club_rsvps")
      .insert([
        {
          book_id,
          name,
          email,
          reminder_sent: false,
        },
      ]);

    if (error) {
      console.error(error);

      return Response.json(
        {
          error: "Failed to save RSVP",
        },
        {
          status: 500,
        }
      );
    }

    // Get book information
    const { data: book } = await supabaseServer
      .from("books")
      .select(
        `
        title,
        author,
        book_club_date,
        book_club_time,
        book_club_location
      `
      )
      .eq("id", book_id)
      .single();

    // Send confirmation email
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject:
        "PWC Book Club RSVP Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; line-height:1.6;">

          <p>Hello ${name || ""},</p>

          <p>
            Your RSVP for the Penn Women's Center Book Club has been received!
          </p>

          <hr />

          <p><strong>Book:</strong> ${book?.title}</p>

          <p><strong>Author:</strong> ${book?.author}</p>

          <p><strong>Date:</strong> ${book?.book_club_date}</p>

          <p><strong>Time:</strong> ${book?.book_club_time}</p>

          <p><strong>Location:</strong> ${book?.book_club_location}</p>

          <hr />

          <p>
            We'll send you a reminder closer to the event.
          </p>

          <p>
            We look forward to seeing you!
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
        error: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}