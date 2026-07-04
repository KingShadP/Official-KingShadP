import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminCookieOptions,
  getAdminCredentialsFromEnv,
  verifyAdminLogin,
} from "@/lib/auth/admin-session";

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = (await request.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const username = body.username?.trim();
  const password = body.password ?? "";
  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  let credentials: ReturnType<typeof getAdminCredentialsFromEnv>;
  try {
    credentials = getAdminCredentialsFromEnv();
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }

  if (!verifyAdminLogin(username, password, credentials.username, credentials.password)) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = createAdminSessionToken(credentials.username, credentials.secret);
  const response = NextResponse.json({
    authenticated: true,
    username: credentials.username,
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, token, getAdminCookieOptions());
  return response;
}
