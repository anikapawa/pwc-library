import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      author,
      genre,
      status,
      goodreads_link,
      description,
      gender_equity_connection,
      cover_image,

      is_favorite,
      is_history_month,
      is_current_book_club_pick,
      is_book_club_selection,

      book_club_date,
      book_club_time,
      book_club_location,
      free_books_left,
    } = body;

    const { data, error } = await supabaseServer
      .from("books")
      .insert([
        {
          title,
          author,
          genre,
          status,
          goodreads_link,
          description,
          gender_equity_connection,
          cover_image,

          is_favorite,
          is_history_month,
          is_current_book_club_pick,
          is_book_club_selection,

          book_club_date,
          book_club_time,
          book_club_location,
          free_books_left,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);

      return NextResponse.json(
        { success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      book: data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}