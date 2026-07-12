import { useState } from "react";
import CodeEditor from "../../components/Editor";
import { useToolState } from "../../lib/useToolState";
import { Button } from "@/components/ui/button";
import { Code2, Share } from "lucide-react";
import { Helmet } from "@/lib/helmet";
import PageMeta from "../../components/PageMeta";

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
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Invalid JSON");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareableUrl());
    alert("Link copied to clipboard!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <PageMeta canonicalPath="/workspace/json-formatter" />

      <Helmet>
        <title>JSON Formatter & Beautifier | DevBox</title>
        <meta
          name="description"
          content="Free online JSON formatter, beautifier, and validator. Format, validate, and share JSON data instantly with DevBox."
        />
        <meta
          name="keywords"
          content="JSON formatter, JSON beautifier, JSON validator, format JSON online, developer tools"
        />
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
              name: "DevBox",
              url: "https://devbox-gamma.vercel.app",
            },
          })}
        </script>
      </Helmet>

      <header className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800 dark:border-blue-900/70 dark:bg-blue-950/50 dark:text-blue-200">
          <Code2 className="h-4 w-4" />
          Live JSON formatting workspace
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">
          Free Online JSON Formatter & Validator
        </h1>
        <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">
          Format messy JSON, validate its structure, and generate a shareable link without leaving the browser.
        </p>
      </header>

      <section aria-label="JSON Editor" className="rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <h2 className="sr-only">JSON Editor</h2>
        <CodeEditor value={jsonInput} onChange={setJsonInput} />
        {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={handleFormat}
            variant="secondary"
            className="bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            Format JSON
          </Button>
          <Button
            onClick={handleCopyLink}
            variant="secondary"
            size="icon"
            className="flex h-10 w-auto items-center gap-2 bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">How to Use the JSON Formatter</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6">
            <li>Paste your JSON into the editor above.</li>
            <li>Click the Format JSON button.</li>
            <li>View your clean, readable JSON output instantly.</li>
            <li>Click Share to copy a link to your formatted JSON.</li>
          </ol>

          <h2 className="mt-8 text-xl font-semibold text-slate-950 dark:text-white">Why Use DevBox JSON Formatter?</h2>
          <ul className="mt-4 list-disc space-y-1 pl-6">
            <li>Fast, secure, and works directly in your browser.</li>
            <li>Automatically detects and highlights syntax errors.</li>
            <li>Generates a shareable URL for collaboration.</li>
            <li>No data is stored or uploaded - 100% client-side.</li>
          </ul>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            Common fixes
          </p>
          <h3 className="mt-3 text-2xl font-bold text-slate-950 dark:text-white">
            Catch the errors that break your JSON
          </h3>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Formatting instantly surfaces the usual culprits: trailing commas, missing quotes, mismatched braces, and
            single quotes where JSON requires double quotes.
          </p>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Example result</p>
            <pre className="mt-3 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
              <code>{`{
  "name": "DevBox",
  "tools": ["json", "regex", "curl"]
}`}</code>
            </pre>
          </div>
        </aside>
      </section>
    </div>
  );
}
