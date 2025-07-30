import { tmdbApi } from "@/lib/tmdb";

export async function GET() {
  try {
    const data = await tmdbApi.getPopular();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch popular movies" },
      { status: 500 }
    );
  }
}

// export async function GET() {
//   try {
//     const data = await tmdbApi.getPopular();
//     return Response.json(data, {
//       headers: {
//         "Cache-Control": "public, max-age=300", // cache for 5 minutes
//       },
//     });
//   } catch (error) {
//     return Response.json({ error: "Failed to fetch" }, { status: 500 });
//   }
// }
