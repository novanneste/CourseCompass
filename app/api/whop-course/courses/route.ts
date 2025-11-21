import { NextRequest, NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/whop-sdk";

interface WhopCourse {
  id: string;
  title: string;
  description?: string;
  owner_id?: string;
  user_id?: string;
  created_by?: string;
}

export async function GET(req: NextRequest) {
  try {
    // Authenticate Whop user
    const user = await verifyUserToken(req.headers);

    if (!user || !user.userId) {
      return NextResponse.json(
        { ok: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const apiKey = process.env.WHOP_APP_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "Missing WHOP_APP_API_KEY" },
        { status: 500 }
      );
    }

    // Fetch courses from Whop API
    const res = await fetch("https://api.whop.com/v2/courses", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({
        ok: false,
        error: "Failed to fetch Whop courses",
      });
    }

    const data = await res.json();

    const list: WhopCourse[] = Array.isArray(data)
      ? data
      : Array.isArray(data.courses)
      ? data.courses
      : Array.isArray(data.data)
      ? data.data
      : [];

    // Only return courses linked to this user
    const owned = list.filter((c) => {
      return (
        c.owner_id === user.userId ||
        c.user_id === user.userId ||
        c.created_by === user.userId
      );
    });

    return NextResponse.json({
      ok: true,
      courses: owned.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description || "",
      })),
    });
  } catch (err) {
    console.error("COURSES API ERROR:", err);
    return NextResponse.json({ ok: false, error: "Server error" });
  }
}
