import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { book_id } = await req.json();

    // Get book information
    const { data: book, error: bookError } = await supabaseServer
      .from("books")
      .select(`
        title,
        author,
        book_club_date,
        book_club_time,
        book_club_location
      `)
      .eq("id", book_id)
      .single();

    if (bookError || !book) {
      return NextResponse.json(
        { error: "Book not found." },
        { status: 404 }
      );
    }

    // Get attendees who still need reminders
    const { data: attendees, error } = await supabaseServer
      .from("book_club_rsvps")
      .select("*")
      .eq("book_id", book_id)
      .eq("reminder_sent", false);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    let sent = 0;

    for (const attendee of attendees ?? []) {
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: attendee.email,
          subject: `Reminder: PWC Book Club`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width:600px; line-height:1.6;">
              <h2>Penn Women's Center Book Club Reminder</h2>

              <p>Hello ${attendee.name || "there"},</p>

              <p>
                This is a reminder that the Penn Women's Center Book Club is coming up!
              </p>

              <hr/>

              <p><strong>Book:</strong> ${book.title}</p>
              <p><strong>Author:</strong> ${book.author}</p>
              <p><strong>Date:</strong> ${book.book_club_date}</p>
              <p><strong>Time:</strong> ${book.book_club_time}</p>
              <p><strong>Location:</strong> ${book.book_club_location}</p>

              <hr/>

              <p>
                We look forward to seeing you!
              </p>
            </div>
          `,
        });

        await supabaseServer
          .from("book_club_rsvps")
          .update({
            reminder_sent: true,
          })
          .eq("id", attendee.id);

        sent++;
      } catch (err) {
        console.error("Failed sending to:", attendee.email, err);
      }
    }

    return NextResponse.json({
      success: true,
      sent,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}