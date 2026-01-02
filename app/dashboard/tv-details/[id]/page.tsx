import { getTVDetails } from "@/lib/tmdb";
import { notFound } from "next/navigation";
import Image from "next/image";

interface TVPageProps {
  params: Promise<{ id: string }>;
}

interface Genre {
  id: number;
  name: string;
}

interface TVDetails {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  first_air_date: string;
  number_of_episodes: number;
  number_of_seasons: number;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  tagline: string;
  status: string;
  production_companies: any[];
  homepage?: string;
}

export default async function TVDetailsPage(props: TVPageProps) {
  const params = await props.params;
  const { id } = params;
  const tvId = Number(id);

  try {
    const tv: TVDetails = await getTVDetails(tvId);

    const formatYear = (dateString: string) => {
      return new Date(dateString).getFullYear();
    };

    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
        {/* Hero Section */}
        <div className="relative h-[80vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
              alt={tv.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent dark:from-gray-900 dark:via-gray-900/60 dark:to-transparent " />
          </div>

          <div className="relative h-full flex items-end">
            <div className="container mx-auto px-6 pb-12 flex gap-8 items-end">
              <div className="flex-shrink-0 hidden md:block">
                <div className="w-64 h-96 rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                    alt={tv.name}
                    width={256}
                    height={384}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 pb-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white">
                  {tv.name}
                </h1>

                <div className="flex items-center gap-4 text-lg text-gray-900 dark:text-gray-300 mb-4">
                  <span>{formatYear(tv.first_air_date)}</span>
                  <span>•</span>
                  <span>{tv.number_of_seasons} Seasons</span>
                  <span>•</span>
                  <span>{tv.number_of_episodes} Episodes</span>
                </div>

                {tv.tagline && (
                  <p className="text-xl text-gray-600 dark:text-gray-400 italic mb-4">
                    {'"'}{tv.tagline}{'"'}
                  </p>
                )}

                <p className="text-lg leading-relaxed max-w-2xl mb-6 line-clamp-4 md:line-clamp-none">
                  {tv.overview}
                </p>

                <div className="flex gap-4">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg">
                    Watch Now
                  </button>
                  <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold transition-colors text-lg">
                    Add to List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {tv.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Production</h3>
                <div className="flex flex-wrap gap-4">
                  {tv.production_companies.map((company) => (
                    <div key={company.id} className="text-gray-600 dark:text-gray-400">
                      {company.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center md:text-left">
                <h3 className="text-lg font-semibold mb-3">Rating</h3>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-yellow-400 text-2xl">⭐</span>
                  <span className="text-2xl font-bold">
                    {tv.vote_average.toFixed(1)}
                  </span>
                  <span className="text-gray-500">
                    ({tv.vote_count.toLocaleString()} votes)
                  </span>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Series Facts</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span>{tv.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">First Aired</span>
                    <span>{new Date(tv.first_air_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Seasons</span>
                    <span>{tv.number_of_seasons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Episodes</span>
                    <span>{tv.number_of_episodes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching TV details:", error);
    notFound();
  }
}
