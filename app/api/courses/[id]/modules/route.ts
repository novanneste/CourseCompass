// app/api/whop-course/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params; // Get the course ID from the URL
  const WHOP_API_KEY = process.env.WHOP_API_KEY; // Your Whop app API key from .env

  if (!WHOP_API_KEY) {
    return NextResponse.json({ ok: false, error: 'Missing WHOP_API_KEY in environment' }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.whop.com/v1/courses/${id}`, {
      headers: {
        Authorization: `Bearer ${WHOP_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: 'Failed to fetch course from Whop' }, { status: res.status });
    }

    const course = await res.json();

    return NextResponse.json({ ok: true, course });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: 'Error fetching course' }, { status: 500 });
  }
}
