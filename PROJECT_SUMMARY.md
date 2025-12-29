# Movie Explorer – Project Summary

## 1. Project Overview
- Next.js movie discovery dashboard built around TMDB content and Supabase-authenticated user sessions.
- Authenticated users land on a dashboard with a trending carousel, lazy-loaded movie shelves, search-driven results, and detailed movie pages; a dedicated TV page virtualizes large grids of shows.
- Next.js API routes proxy TMDB endpoints with validation and caching headers to shield the client from direct API calls.

## 2. Tech Stack
- Next.js 15 App Router with React 18 and TypeScript (dev via Turbopack).
- Tailwind CSS v4 with HeroUI components, next-themes, and Google font integration.
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`) for auth/session management, `@tanstack/react-query` for client caching, `axios`/`fetch` for TMDB, plus `react-hot-toast`, `react-window`, `lucide-react`, and `clsx`.

## 3. Architecture & Folder Structure
- `app/` – root layout, providers, error/loading boundaries, login + auth confirmation routes, dashboard sections (`movies`, `movie-details/[slug]`, `tv-shows`), and REST-style handlers under `api/movies/*`.
- `components/` – reusable UI (Navbar, theme switch, cards, carousel, lazy sections, profile menu) built mostly on HeroUI and Tailwind.
- `hooks/` – `useMovieSearch` (React Query wrapper) and `useInView` (IntersectionObserver helper) for view-triggered loading.
- `lib/tmdb.ts` – TMDB client with caching windows, error typing, and shared fetch utilities.
- `utils/supabase/` + root `middleware.ts` – SSR/browser Supabase clients, cookie syncing, and auth-guard middleware; `config/`, `styles/`, `assets/`, `types/` supply site metadata, Tailwind entry point, imagery, and shared types.

## 4. Authentication Flow
- `utils/supabase/server.ts` and `client.ts` instantiate Supabase via `@supabase/ssr`, sharing `NEXT_PUBLIC_SUPABASE_*` env vars across server and browser contexts.
- `middleware.ts` delegates to `utils/supabase/middleware.ts` to refresh sessions, copy cookies, redirect unauthenticated traffic to `/login`, and prevent logged-in users from revisiting `/login`.
- `app/login/page.tsx` is a client form that signs users in/out via the Supabase browser client, triggers `exchangeCodeForSession` when an email link returns, and surfaces toast feedback.
- `app/auth/confirm/route.ts` completes email OTP flows: verifies the token, strips sensitive params, and redirects to `/dashboard` or `/error`.
- `components/profileDropdown.tsx` calls `supabase.auth.signOut()` and routes back to `/login`, providing the primary sign-out affordance.

## 5. Data Fetching & APIs
- `lib/tmdb.ts` centralizes TMDB access with `fetch`/`axios`, response typing, and `TMDBError` classification; revalidation windows tailor cache duration per endpoint.
- API routes in `app/api/movies/[popular|top-rated|upcoming]/route.ts` validate the `page` param, set CDN-friendly cache headers, and map TMDB errors to HTTP statuses.
- `app/dashboard/page.tsx` preloads trending movies server-side for the hero carousel, catching and handling SSR failures.
- `app/dashboard/movies/page.tsx` performs an SSR search when `search` is provided, passing results to `SearchResults`, which relies on `useMovieSearch`/React Query for client revalidation with custom retry rules.
- `components/lazyMovieSection.tsx` watches viewport entry via `useInView`, fetches section data from the Next API, caches results in-memory per endpoint, and exposes retry UI.
- `app/dashboard/tv-shows/page.tsx` fetches 15 pages of popular shows in parallel, deduplicates them, and renders via `react-window`; `app/providers.tsx` configures a shared QueryClient (stale/GC timings, retry guard for 4xx).

## 6. UI/UX Features
- HeroUI-based `Navbar` with theme toggle, profile menu, and debounced search that routes to `/dashboard/movies?search=...`.
- `MovieCarousel` snap-scroll hero logic with scaling cards, genre badges, and calls-to-action.
- `MovieCard`/`TVCard` components provide fallback imagery, ratings, and detail links, while `SearchResults` renders responsive grids with loading/error states.
- `LazyMovieSection` delivers skeleton placeholders, cached fetches, and retry messaging to reduce redundant TMDB calls.
- TV shows grid leverages `react-window` for performance; global loading placeholders (`app/loading.tsx`, `app/login/loading.tsx`) and the layout-level `Toaster` shape consistent feedback.

## 7. Observations or Improvements
- `app/login/page.tsx:188` attaches async handlers to the `formAction` attribute inside a client component; browsers treat this as a string URL, so submissions skip the Supabase logic—swap to `onSubmit`/`onClick` handlers or move the form to a server action.
- `app/dashboard/movie-details/[slug]/page.tsx:5` imports `react-hot-toast` and invokes `toast.error` in a Server Component catch block (`line 271`), which cannot run during SSR—handle errors via redirects or surface them in a client wrapper.
- `components/profileDropdown.tsx:59` renders placeholder name/email instead of the Supabase session, so the dropdown always shows “John Doe”—load the authenticated user profile before displaying.
- `components/tvCard.tsx:35` links to `/dashboard/tv-details/:id`, but no matching route exists, yielding a 404 when clicked—add the page or adjust the link.
- `app/dashboard/tv-shows/page.tsx:52` requests 15 TMDB pages client-side using a public API key, which is heavy and exposes rate-limit pressure—consider moving to a server route with pagination or caching.
