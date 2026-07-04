import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminCookieOptions,
  getAdminCredentialsFromEnv,
  getAdminSessionFromCookies,
} from "@/lib/auth/admin-session";

export async function POST() {
  let secret: string;
  try {
    secret = getAdminCredentialsFromEnv().secret;
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }

  const session = getAdminSessionFromCookies(await cookies(), secret);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const token = createAdminSessionToken(session.username, secret);
  const response = NextResponse.json({
    authenticated: true,
    username: session.username,
  });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, getAdminCookieOptions());
  return response;
}
