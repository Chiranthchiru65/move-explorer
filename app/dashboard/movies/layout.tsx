export default function MoviesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 mt-4">
      {children}
    </section>
  );
}
