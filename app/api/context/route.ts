import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";

export async function GET() {
  try {
    const headerList = await headers();

    // Verify Whop session
    const { userId } = await whopsdk.verifyUserToken(headerList);

    // Fetch user profile
    const user = await whopsdk.users.retrieve(userId);

    // Determine role safely
    const role =
      "apps" in user && Array.isArray((user as any).apps)
        ? "owner"
        : "member";

    return NextResponse.json({ ok: true, role, user });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 401 });
  }
}
