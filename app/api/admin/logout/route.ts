import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getAdminCookieOptions } from "@/lib/auth/admin-session";

export async function POST() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", getAdminCookieOptions(0));
  return response;
}
