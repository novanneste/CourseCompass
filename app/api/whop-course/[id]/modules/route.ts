import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const res = await fetch(`https://api.whop.com/v1/courses/${id}/modules`, {
      headers: {
        Authorization: `Bearer ${process.env.WHOP_API_KEY}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "Failed to fetch modules" }, { status: res.status });
    }

    const modules = await res.json();

    return NextResponse.json({ ok: true, modules });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
