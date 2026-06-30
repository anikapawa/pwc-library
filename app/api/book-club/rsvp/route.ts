import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      book_id,
      name,
      email,
    } = body;

    // Prevent duplicate RSVPs for the same email + book
    const { data: existing } = await supabaseServer
      .from("book_club_rsvps")
      .select("id")
      .eq("book_id", book_id)
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return Response.json(
        {
          error: "You have already RSVP'd for this book club.",
        },
        { status: 400 }
      );
    }

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