import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.whop.com/api/v2/courses", {
      headers: {
        Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
      },
    });

    const json = await res.json();

    return NextResponse.json({
      ok: true,
      courses: json?.data || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
