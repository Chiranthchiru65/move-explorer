export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + HeroUI",
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
  ],
};
