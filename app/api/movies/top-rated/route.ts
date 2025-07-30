import { tmdbApi } from "@/lib/tmdb";

export async function GET() {
  try {
    const data = await tmdbApi.getTopRated();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch top rated movies" },
      { status: 500 }
    );
  }
}
