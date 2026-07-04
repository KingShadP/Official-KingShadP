import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In — KingShadP",
  description: "Administrative sign-in for the KingShadP archive.",
};

export default function AdminLoginPage() {
  return (
    <section className="max-w-md mx-auto px-6 pt-36 pb-24">
      <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bronze mb-4">Admin Access</p>
      <h1 className="font-serif font-light text-5xl text-ivory mb-4">Sign In</h1>
      <p className="mb-8 font-serif font-light text-lg text-ivory/65 leading-relaxed">
        Restricted access for archive administration and publishing tasks.
      </p>
      <AdminLoginForm />
    </section>
  );
}
