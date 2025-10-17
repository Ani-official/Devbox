import { useState } from "react";
import CodeEditor from "../../components/Editor";
import { useToolState } from "../../lib/useToolState";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function JsonFormatter() {
  const [jsonInput, setJsonInput, getShareableUrl] = useToolState(
    "devbox-json-formatter",
    "{}",
    "data"
  );
  const [error, setError] = useState<string | null>(null);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareableUrl());
    alert("Link copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* ✅ SEO + Meta Tags */}
      <Helmet>
        <title>JSON Formatter & Beautifier | DevBox</title>
        <meta
          name="description"
          content="Free online JSON formatter, beautifier, and validator. Format, validate, and share JSON data instantly with DevBox’s simple developer tools."
        />
        <meta
          name="keywords"
          content="JSON formatter, JSON beautifier, JSON validator, format JSON online, developer tools"
        />

        {/* Open Graph */}
        <meta property="og:title" content="JSON Formatter & Beautifier | DevBox" />
        <meta
          property="og:description"
          content="Easily format, beautify, and validate JSON data online. Share your formatted JSON using a simple link with DevBox."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://devbox-gamma.vercel.app/workspace/json-formatter"
        />
        <meta
          property="og:image"
          content="https://devbox-gamma.vercel.app/preview-json.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="JSON Formatter & Beautifier | DevBox" />
        <meta
          name="twitter:description"
          content="Free online JSON formatter and beautifier. Validate and share JSON instantly with DevBox."
        />
        <meta
          name="twitter:image"
          content="https://devbox-gamma.vercel.app/preview-json.png"
        />

        {/* Canonical */}
        <link
          rel="canonical"
          href="https://devbox-gamma.vercel.app/workspace/json-formatter"
        />

        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "JSON Formatter & Beautifier | DevBox",
            description:
              "Free online JSON formatter and validator for developers. Format and share JSON instantly.",
            url: "https://devbox-gamma.vercel.app/workspace/json-formatter",
            mainEntity: {
              "@type": "SoftwareApplication",
              name: "JSON Formatter",
              applicationCategory: "DeveloperTool",
              operatingSystem: "Web",
            },
            publisher: {
              "@type": "Organization",
              name: "DevBox Tools",
              url: "https://devbox-gamma.vercel.app",
            },
          })}
        </script>
      </Helmet>

      {/* ✅ Main Content */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          Free Online JSON Formatter & Validator
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Beautify and validate your JSON instantly using DevBox’s online JSON
          formatter. Whether you’re debugging API responses or preparing JSON for
          documentation, this tool helps you format and share your data with ease.
        </p>
      </header>

      {/* ✅ Interactive Tool */}
      <section aria-label="JSON Editor">
        <h2 className="sr-only">JSON Editor</h2>
        <CodeEditor value={jsonInput} onChange={setJsonInput} />
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <div className="mt-4 flex gap-2">
          <Button
            onClick={handleFormat}
            variant="secondary"
            className="px-4 py-2 bg-green-600 text-white hover:bg-green-700"
          >
            Format JSON
          </Button>
          <Button
            onClick={handleCopyLink}
            variant="secondary"
            size="icon"
            className="w-20 flex items-center gap-2 px-4 py-2 bg-blue-700 text-white hover:bg-blue-600"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
      </section>

      {/* ✅ Informational Section for SEO */}
      <section className="mt-10 space-y-3 text-gray-700 leading-relaxed">
        <h2 className="text-xl font-semibold">How to Use the JSON Formatter</h2>
        <ol className="list-decimal ml-6 space-y-2">
          <li>Paste your JSON into the editor above.</li>
          <li>Click the <strong>“Format JSON”</strong> button.</li>
          <li>View your clean, readable JSON output instantly.</li>
          <li>Click <strong>“Share”</strong> to copy a link to your formatted JSON.</li>
        </ol>

        <h2 className="text-xl font-semibold mt-6">Why Use DevBox JSON Formatter?</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Fast, secure, and works directly in your browser.</li>
          <li>Automatically detects and highlights syntax errors.</li>
          <li>Generates a shareable URL for collaboration.</li>
          <li>No data is stored or uploaded — 100% client-side.</li>
        </ul>
      </section>
    </div>
  );
}
