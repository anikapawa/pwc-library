import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

/* ---------------- UPDATE BOOK ---------------- */

export async function PUT(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      title,
      author,
      genre,
      status,
      goodreads_link,
      cover_image,
      description,
      gender_equity_connection,
      is_favorite,
      is_history_month,
      is_current_book_club_pick,
      is_book_club_selection,
      book_club_date,
      book_club_time,
      book_club_location,
      free_books_left,
    } = body;

    /* ---------------- GUARDRAIL ---------------- */
    // If this book is being set as current pick,
    // unset all others first
    if (is_current_book_club_pick) {
      await supabaseServer
        .from("books")
        .update({ is_current_book_club_pick: false,
          is_book_club_selection: true,
        })
        .neq("id", Number(id));
    }

    /* ---------------- UPDATE ---------------- */
    const { data, error } = await supabaseServer
      .from("books")
      .update({
        ...(title !== undefined && { title }),
        ...(author !== undefined && { author }),
        ...(genre !== undefined && { genre }),
        ...(status !== undefined && { status }),
        ...(goodreads_link !== undefined && { goodreads_link }),
        ...(cover_image !== undefined && { cover_image }),
        ...(description !== undefined && { description }),
        ...(gender_equity_connection !== undefined && {
          gender_equity_connection,
        }),

        ...(is_favorite !== undefined && { is_favorite }),
        ...(is_history_month !== undefined && {
          is_history_month,
        }),
        ...(is_current_book_club_pick !== undefined && {
          is_current_book_club_pick,
        }),
        ...(is_book_club_selection !== undefined && {
          is_book_club_selection,
        }),

        ...(book_club_date !== undefined && {
          book_club_date,
        }),
        ...(book_club_time !== undefined && {
          book_club_time,
        }),
        ...(book_club_location !== undefined && {
          book_club_location,
        }),
        ...(free_books_left !== undefined && {
          free_books_left,
        }),
      })
      .eq("id", Number(id))
      .select();

    if (error) {
      console.error("UPDATE ERROR:", error);

      return NextResponse.json(
        { success: false, error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      book: data,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}

/* ---------------- DELETE BOOK ---------------- */

export async function DELETE(
  req: Request,
  { params }: Props
) {
  try {
    const { id } = await params;

    const { error } = await supabaseServer
      .from("books")
      .delete()
      .eq("id", Number(id));

    if (error) {
      console.error("DELETE ERROR:", error);

      return NextResponse.json(
        { success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}