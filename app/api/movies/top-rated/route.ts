// app/api/movies/upcoming/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUpcoming, TMDBError } from "@/lib/tmdb"; // Ensure getUpcoming is imported

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));

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

    console.log(`🔄 API: Fetching upcoming movies (page ${page})`);

    const data = await getUpcoming(page);

    // FIX: Check if data exists before accessing properties
    if (!data) {
      throw new Error("No data received from TMDB service");
    }

    console.log(
      ` API: Upcoming movies fetched successfully (${data.results.length} movies)`
    );

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200", // 24 hours cache
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(" API: Upcoming movies error:", error);

    if (error instanceof TMDBError) {
      const statusMap: Record<string, number> = {
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

    return NextResponse.json(
      {
        error: "Failed to fetch upcoming movies. Please try again later.",
        type: "server",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
