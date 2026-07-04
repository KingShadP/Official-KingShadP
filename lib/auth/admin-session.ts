import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "ksp_admin_session";
const TOKEN_TTL_SECONDS = 60 * 60 * 8;

type JwtHeader = { alg: "HS256"; typ: "JWT" };
type JwtPayload = {
  sub: string;
  role: "admin";
  iat: number;
  exp: number;
};

export type AdminSession = {
  username: string;
  issuedAt: number;
  expiresAt: number;
};

type CookieStoreLike = {
  get(name: string): { value: string } | undefined;
};

function base64UrlEncode(value: string | Buffer): string {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return Buffer.from(`${padded}${padding}`, "base64").toString("utf8");
}

function hmacSign(input: string, secret: string): string {
  return createHmac("sha256", secret).update(input).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

export function getAdminCredentialsFromEnv() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!username || !password || !secret) {
    throw new Error("Missing ADMIN_USERNAME, ADMIN_PASSWORD, or ADMIN_SESSION_SECRET.");
  }
  return { username, password, secret };
}

export function verifyAdminLogin(inputUsername: string, inputPassword: string, expectedUsername: string, expectedPassword: string): boolean {
  return safeEqual(inputUsername, expectedUsername) && safeEqual(inputPassword, expectedPassword);
}

export function createAdminSessionToken(username: string, secret: string, nowEpochSeconds = Math.floor(Date.now() / 1000)): string {
  const header: JwtHeader = { alg: "HS256", typ: "JWT" };
  const payload: JwtPayload = {
    sub: username,
    role: "admin",
    iat: nowEpochSeconds,
    exp: nowEpochSeconds + TOKEN_TTL_SECONDS,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = hmacSign(signingInput, secret);
  return `${signingInput}.${signature}`;
}

export function verifyAdminSessionToken(token: string, secret: string, nowEpochSeconds = Math.floor(Date.now() / 1000)): AdminSession | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const expectedSignature = hmacSign(`${encodedHeader}.${encodedPayload}`, secret);
  if (!safeEqual(signature, expectedSignature)) return null;

  let payload: JwtPayload;
  try {
    payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload;
  } catch {
    return null;
  }

  if (!payload || payload.role !== "admin" || typeof payload.sub !== "string") return null;
  if (typeof payload.iat !== "number" || typeof payload.exp !== "number") return null;
  if (payload.exp <= nowEpochSeconds) return null;

  return {
    username: payload.sub,
    issuedAt: payload.iat,
    expiresAt: payload.exp,
  };
}

export function getAdminSessionFromCookies(cookieStore: CookieStoreLike, secret: string): AdminSession | null {
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token, secret);
}

export function getAdminCookieOptions(maxAgeSeconds = TOKEN_TTL_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
