import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    courses: [],
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();

    return NextResponse.json({
      ok: true,
      id,
      title,
      description,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}