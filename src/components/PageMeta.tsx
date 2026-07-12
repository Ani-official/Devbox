import { Helmet } from "@/lib/helmet";
import { useLocation } from "react-router-dom";

type PageMetaProps = {
  title?: string;
  description?: string;
  canonicalPath?: string;
  robots?: string;
  image?: string;
  schema?: Record<string, unknown>;
  noindexQueryParams?: boolean;
};

export default function PageMeta({
  title,
  description,
  canonicalPath,
  robots,
  image,
  schema,
  noindexQueryParams = true,
}: PageMetaProps) {
  const location = useLocation();
  const hasQueryString = Boolean(location.search);
  const canonicalUrl = canonicalPath
    ? `https://devbox-gamma.vercel.app${canonicalPath}`
    : "";
  const shouldNoindex = noindexQueryParams && hasQueryString;

  return (
    <Helmet>
      {title ? <title>{title}</title> : null}
      {description ? <meta name="description" content={description} /> : null}
      {canonicalPath ? <link rel="canonical" href={canonicalUrl} /> : null}
      <meta name="robots" content={robots ?? (shouldNoindex ? "noindex,follow" : "index,follow")} />
      {title ? <meta property="og:title" content={title} /> : null}
      {description ? <meta property="og:description" content={description} /> : null}
      {canonicalPath ? <meta property="og:url" content={canonicalUrl} /> : null}
      <meta property="og:type" content="website" />
      {image ? <meta property="og:image" content={image} /> : null}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      {title ? <meta name="twitter:title" content={title} /> : null}
      {description ? <meta name="twitter:description" content={description} /> : null}
      {image ? <meta name="twitter:image" content={image} /> : null}
      {schema ? (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      ) : null}
    </Helmet>
  );
}
