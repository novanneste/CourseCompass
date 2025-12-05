import { NextRequest, NextResponse } from "next/server";
import { getCourseById } from "@/lib/queries/courses";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "Missing course ID" },
        { status: 400 }
      );
    }

    const course = await getCourseById(id);

    if (!course) {
      return NextResponse.json(
        { ok: false, error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      course,
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}
