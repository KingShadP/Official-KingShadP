"use client";

import { useMemo, useState } from "react";

type TryOnStudioProps = {
  productTitle: string;
  productImageUrl: string | null;
};

export function TryOnStudio({ productTitle, productImageUrl }: TryOnStudioProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  async function handleSubmit() {
    if (!file) {
      setStatus("Choose or capture a photo first.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("productTitle", productTitle);
    if (productImageUrl) {
      formData.append("productImageUrl", productImageUrl);
    }

    setLoading(true);
    setStatus(null);

    const response = await fetch("/api/try-on", {
      method: "POST",
      body: formData,
    });

    const payload = (await response.json().catch(() => null)) as { message?: string; imageUrl?: string; error?: string } | null;
    setLoading(false);

    if (!response.ok) {
      setStatus(payload?.error ?? "Try-on generation failed.");
      return;
    }

    setStatus(payload?.imageUrl ?? payload?.message ?? "Try-on request submitted.");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 border border-bronze/40 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bronze transition hover:border-bronze hover:bg-bronze/10"
      >
        Try on
      </button>

      {open ? (
        <div className="fixed inset-0 z-[230] bg-black/90 px-6 py-10 backdrop-blur-sm">
          <div className="mx-auto max-w-3xl border border-ivory/10 bg-void p-6 md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-bronze mb-3">AI Try-On</p>
                <h2 className="font-serif text-3xl md:text-4xl font-light text-ivory">Preview {productTitle}</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-ivory/60 hover:text-bronze"
              >
                Close
              </button>
            </div>

            <p className="mb-6 font-serif text-base md:text-lg leading-relaxed text-ivory/70">
              Best results come from a straight-on photo with your full torso visible, even lighting, minimal background clutter, and fitted neutral clothing.
            </p>

            <div className="mb-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setMode("upload")}
                className={`border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] transition ${
                  mode === "upload" ? "border-bronze/60 text-bronze" : "border-ivory/15 text-ivory/55 hover:text-ivory"
                }`}
              >
                Upload photo
              </button>
              <button
                type="button"
                onClick={() => setMode("camera")}
                className={`border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.3em] transition ${
                  mode === "camera" ? "border-bronze/60 text-bronze" : "border-ivory/15 text-ivory/55 hover:text-ivory"
                }`}
              >
                Use camera
              </button>
            </div>

            <label className="block border border-ivory/10 p-5">
              <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.3em] text-ivory/45">
                {mode === "camera" ? "Capture a portrait photo" : "Upload a portrait photo"}
              </span>
              <input
                type="file"
                accept="image/*"
                capture={mode === "camera" ? "user" : undefined}
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="block w-full text-sm text-ivory/70 file:mr-4 file:border file:border-bronze/40 file:bg-transparent file:px-4 file:py-2 file:font-mono file:text-[10px] file:uppercase file:tracking-[0.25em] file:text-bronze"
              />
            </label>

            {previewUrl ? (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="border border-ivory/10 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="User preview" className="aspect-[4/5] w-full object-cover" />
                </div>
                {productImageUrl ? (
                  <div className="border border-ivory/10 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={productImageUrl} alt={productTitle} className="aspect-[4/5] w-full object-cover" />
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="border border-bronze/45 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-bronze transition hover:border-bronze hover:bg-bronze/10 disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate try-on"}
              </button>
              {status ? <p className="font-serif text-sm text-ivory/65 break-all">{status}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
