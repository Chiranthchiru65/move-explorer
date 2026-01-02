export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Streamr",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/dashboard",
    },
    {
      label: "Movies",
      href: "/dashboard/movies",
    },
    {
      label: "Tv Shows",
      href: "/dashboard/tv-shows",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/dashboard",
    },
    {
      label: "movies",
      href: "/dashboard/movies",
    },
    {
      label: "Tv Shows",
      href: "/dashboard/tv-shows",
    },
  ],
};
