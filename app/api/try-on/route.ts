import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const photo = formData.get("photo");
  const productTitle = formData.get("productTitle");
  const productImageUrl = formData.get("productImageUrl");

  if (!(photo instanceof File)) {
    return NextResponse.json({ error: "A photo upload is required." }, { status: 400 });
  }

  if (typeof productTitle !== "string" || productTitle.trim().length === 0) {
    return NextResponse.json({ error: "A product title is required." }, { status: 400 });
  }

  const endpoint = process.env.AI_TRYON_ENDPOINT;
  const apiKey = process.env.AI_TRYON_API_KEY;

  if (!endpoint || !apiKey) {
    return NextResponse.json(
      {
        error:
          "AI try-on is ready to integrate, but AI_TRYON_ENDPOINT and AI_TRYON_API_KEY are not configured yet.",
      },
      { status: 501 }
    );
  }

  const upstreamFormData = new FormData();
  upstreamFormData.append("photo", photo);
  upstreamFormData.append("productTitle", productTitle);
  if (typeof productImageUrl === "string" && productImageUrl.length > 0) {
    upstreamFormData.append("productImageUrl", productImageUrl);
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: upstreamFormData,
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `AI try-on provider returned ${response.status}.` },
      { status: 502 }
    );
  }

  const payload = (await response.json()) as { imageUrl?: string; message?: string };
  return NextResponse.json({
    imageUrl: payload.imageUrl,
    message: payload.message ?? "Try-on generated successfully.",
  });
}
