import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminCredentialsFromEnv, getAdminSessionFromCookies } from "@/lib/auth/admin-session";

export const metadata: Metadata = {
  title: "Admin — KingShadP",
  description: "Admin control surface.",
};

export default async function AdminPage() {
  let secret: string;
  try {
    secret = getAdminCredentialsFromEnv().secret;
  } catch {
    return (
      <section className="max-w-3xl mx-auto px-6 lg:px-12 pt-36 pb-24">
        <h1 className="font-serif text-4xl text-ivory mb-6">Admin is not configured.</h1>
        <p className="text-ivory/70 font-mono text-xs tracking-wide">
          Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET in .env.local.
        </p>
      </section>
    );
  }

  const session = getAdminSessionFromCookies(await cookies(), secret);
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <section className="max-w-3xl mx-auto px-6 lg:px-12 pt-36 pb-24">
      <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bronze mb-4">Admin Session</p>
      <h1 className="font-serif font-light text-5xl text-ivory mb-6">Control Surface</h1>
      <p className="text-ivory/75 mb-10">
        Signed in as <span className="text-ivory">{session.username}</span>.
      </p>
      <form action="/api/admin/logout" method="post">
        <button
          type="submit"
          className="font-mono text-[10px] tracking-[0.3em] uppercase px-5 py-3 border border-ivory/20 text-ivory/90 hover:border-bronze/60 hover:text-bronze transition-colors"
        >
          Logout
        </button>
      </form>
    </section>
  );
}
