import { NextRequest, NextResponse } from "next/server";
import { inquiryRepository } from "../../../src/db/repositories";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, topic, message, organization } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "Required fields are missing." }, { status: 400 });
    }

    const item = await inquiryRepository.create({
      name,
      email,
      organization: organization || "",
      inquiryType: topic || "general",
      message,
      consentVersion: "v1"
    });

    return NextResponse.json({ success: true, inquiry: item });
  } catch (err: any) {
    console.error("Inquiry registration failure:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to submit inquiry." }, { status: 500 });
  }
}
