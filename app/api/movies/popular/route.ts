import { NextRequest, NextResponse } from "next/server";
import { getPopular, TMDBError } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));

    // Validate page number (TMDB has max 500 pages)
    if (page > 500) {
      return NextResponse.json(
        {
          error: "Page number cannot exceed 500",
          type: "validation",
          code: "INVALID_PAGE",
        },
        { status: 400 }
      );
    }

    const data = await getPopular(page);

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=7200, stale-while-revalidate=3600", // 2 hours cache
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(" API: Popular movies error:", error);

    if (error instanceof TMDBError) {
      // Map TMDB errors to appropriate HTTP status codes
      const statusMap = {
        auth: 401,
        not_found: 404,
        rate_limit: 429,
        server: 502,
        network: 503,
      };

      return NextResponse.json(
        {
          error: error.message,
          type: error.type,
          code: "TMDB_ERROR",
        },
        { status: statusMap[error.type] || 500 }
      );
    }

    // Generic server error
    return NextResponse.json(
      {
        error: "Failed to fetch popular movies. Please try again later.",
        type: "server",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
