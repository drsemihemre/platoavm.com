type Props = {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
};

export function PageHero({ title, subtitle, breadcrumb }: Props) {
  return (
    <section className="bg-gradient-to-br from-stone-900 to-stone-700 text-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {breadcrumb && (
          <p className="text-sm text-stone-300 mb-2">
            <a href="/" className="hover:text-white">Ana Sayfa</a>
            <span className="mx-2">/</span>
            <span className="text-orange-400">{breadcrumb}</span>
          </p>
        )}
        <h1 className="text-4xl md:text-5xl font-extrabold">{title}</h1>
        {subtitle && (
          <p className="mt-3 text-lg text-stone-200 max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
