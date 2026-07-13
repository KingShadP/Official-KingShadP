import { NextRequest, NextResponse } from "next/server";
import { contentRepository, productRepository } from "../../../src/db/repositories";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query || query.trim() === "") {
      return NextResponse.json({ success: true, articles: [], products: [] });
    }

    // Run searches in parallel
    const [articles, products] = await Promise.all([
      contentRepository.search(query, 10),
      productRepository.search(query, 10)
    ]);

    return NextResponse.json({
      success: true,
      articles,
      products
    });
  } catch (err: any) {
    console.error("Search index retrieval failure:", err);
    return NextResponse.json({ success: false, error: err.message || "Search execution failed." }, { status: 500 });
  }
}
