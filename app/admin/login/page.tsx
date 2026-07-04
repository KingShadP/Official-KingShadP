"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(payload?.error ?? "Login failed.");
      setSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <section className="max-w-md mx-auto px-6 pt-36 pb-24">
      <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bronze mb-4">Admin Access</p>
      <h1 className="font-serif font-light text-5xl text-ivory mb-8">Sign In</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="block font-mono text-[10px] tracking-[0.25em] uppercase text-ivory/50 mb-2">Username</span>
          <input
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full bg-panel border border-ivory/20 px-4 py-3 text-ivory outline-none focus:border-bronze/70"
            required
          />
        </label>

        <label className="block">
          <span className="block font-mono text-[10px] tracking-[0.25em] uppercase text-ivory/50 mb-2">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full bg-panel border border-ivory/20 px-4 py-3 text-ivory outline-none focus:border-bronze/70"
            required
          />
        </label>

        {error && <p className="font-mono text-[10px] tracking-wide text-[#ff8a8a]">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="font-mono text-[10px] tracking-[0.3em] uppercase px-5 py-3 border border-ivory/20 text-ivory/90 hover:border-bronze/60 hover:text-bronze transition-colors disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  );
}
