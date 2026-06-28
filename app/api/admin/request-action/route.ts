import { NextResponse } from "next/server";
import { updateRequestStatus } from "../../../../lib/requests";
import { supabaseServer } from "../../../../lib/supabase-server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, status, action } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    console.log("api/request-action body:", body);

    // -----------------------------------
    // ARCHIVE ACTION 
    // -----------------------------------
    if (action === "archive") {
      const { error } = await supabaseServer
        .from("requests")
        .update({ archived: true })
        .eq("id", id);

      if (error) {
        console.error("archive error:", error);
        return NextResponse.json(
          { success: false, error: "Archive failed" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, archived: true });
    }

    // -----------------------------------
    // STATUS UPDATE FLOW (existing logic)
    // -----------------------------------
    if (!status) {
      return NextResponse.json(
        { error: "Missing status" },
        { status: 400 }
      );
    }

    const result = await updateRequestStatus(id, status);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("request-action error:", error);

    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}