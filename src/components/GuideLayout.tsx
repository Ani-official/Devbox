import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@/lib/helmet";
import PageMeta from "./PageMeta";

export type Faq = { q: string; a: string };
type RelLink = { label: string; to: string };

type GuideLayoutProps = {
  title: string;
  description: string;
  canonicalPath: string;
  updated?: string;
  readingTime?: string;
  children: ReactNode;
  faqs?: Faq[];
  relatedTools?: RelLink[];
  relatedGuides?: RelLink[];
};

const SITE = "https://devbox-gamma.vercel.app";

export default function GuideLayout({
  title,
  description,
  canonicalPath,
  updated = "July 2026",
  readingTime,
  children,
  faqs = [],
  relatedTools = [],
  relatedGuides = [],
}: GuideLayoutProps) {
  const url = `${SITE}${canonicalPath}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url,
    author: { "@type": "Organization", name: "DevBox" },
    publisher: {
      "@type": "Organization",
      name: "DevBox",
      url: SITE,
    },
    dateModified: "2026-07-01",
  };

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <article className="mx-auto max-w-3xl px-1 py-6 text-gray-700 dark:text-gray-300">
      <PageMeta title={`${title} | DevBox`} description={description} canonicalPath={canonicalPath} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        {faqSchema ? <script type="application/ld+json">{JSON.stringify(faqSchema)}</script> : null}
      </Helmet>

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/guides" className="hover:text-blue-600 dark:hover:text-blue-400">
              Guides
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-700 dark:text-gray-300" aria-current="page">
            {title}
          </li>
        </ol>
      </nav>

      <header className="mb-8 border-b border-gray-200 pb-6 dark:border-gray-800">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">{description}</p>
        <p className="mt-4 text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
          Updated {updated}
          {readingTime ? ` · ${readingTime}` : ""}
        </p>
      </header>

      {/* Body — guide prose. Uses the `guide-prose` class for consistent spacing. */}
      <div className="guide-prose space-y-5 leading-relaxed">{children}</div>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="mt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 dark:text-white">
            Frequently asked questions
          </h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
            {faqs.map((f, i) => (
              <details
                key={f.q}
                className={`group px-5 py-4 open:bg-gray-50 dark:open:bg-gray-900/40 ${
                  i === 0 ? "" : "border-t border-gray-200 dark:border-gray-800"
                }`}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-gray-900 dark:text-white">
                  {f.q}
                  <span className="text-gray-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related */}
      {(relatedTools.length > 0 || relatedGuides.length > 0) && (
        <section className="mt-12 grid gap-6 border-t border-gray-200 pt-8 dark:border-gray-800 sm:grid-cols-2">
          {relatedTools.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Try the tools</h2>
              <ul className="mt-3 space-y-2">
                {relatedTools.map((t) => (
                  <li key={t.to}>
                    <Link to={t.to} className="text-blue-600 hover:underline dark:text-blue-400">
                      {t.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {relatedGuides.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Related guides</h2>
              <ul className="mt-3 space-y-2">
                {relatedGuides.map((g) => (
                  <li key={g.to}>
                    <Link to={g.to} className="text-blue-600 hover:underline dark:text-blue-400">
                      {g.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </article>
  );
}
