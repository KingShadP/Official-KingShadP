import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAdminCredentialsFromEnv, getAdminSessionFromCookies } from "@/lib/auth/admin-session";

export async function GET() {
  let secret: string;
  try {
    secret = getAdminCredentialsFromEnv().secret;
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }

  const session = getAdminSessionFromCookies(await cookies(), secret);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    username: session.username,
    expiresAt: session.expiresAt,
  });
}
