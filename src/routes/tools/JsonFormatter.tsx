import { useState } from "react";
import CodeEditor from "../../components/Editor";
import { useToolState } from "../../lib/useToolState";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function JsonFormatter() {
  // Hook handles localStorage + optional URL query param
  const [jsonInput, setJsonInput, getShareableUrl] = useToolState(
    "devbox-json-formatter",
    "{}",
    "data"
  );
  const [error, setError] = useState<string | null>(null);

  // Format JSON
  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Copy shareable URL
  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareableUrl());
    alert("Link copied to clipboard!");
  };

  return (
    <div>
      <Helmet>
        <title>JSON Formatter & Beautifier | DevBox</title>
        <meta
          name="description"
          content="Free online JSON formatter and beautifier. Validate, format, and share JSON instantly with DevBox's developer tools."
        />
        <meta name="keywords" content="JSON formatter, JSON beautifier, online JSON validator, JSON tool, format JSON" />

        {/* Open Graph */}
        <meta property="og:title" content="JSON Formatter & Beautifier | DevBox" />
        <meta property="og:description" content="Easily format and validate JSON data online. Share formatted JSON with a unique URL. Perfect for developers and API debugging." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/workspace/json-formatter" />
        <meta property="og:image" content="https://yourdomain.com/preview-json.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="JSON Formatter & Beautifier | DevBox" />
        <meta name="twitter:description" content="Free online JSON formatter and beautifier. Validate, format, and share JSON instantly with DevBox." />
        <meta name="twitter:image" content="https://yourdomain.com/preview-json.png" />

        {/* Canonical */}
        <link rel="canonical" href="https://yourdomain.com/workspace/json-formatter" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "JSON Formatter",
            applicationCategory: "DeveloperTool",
            operatingSystem: "Web",
            description: "Online JSON formatter and validator to beautify and validate JSON instantly.",
            url: "https://yourdomain.com/workspace/json-formatter"
          })}
        </script>
      </Helmet>

      <h2 className="text-2xl font-semibold mb-4">JSON Formatter</h2>
      <CodeEditor value={jsonInput} onChange={setJsonInput} />
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <div className="mt-4 flex gap-2">
        <Button
          onClick={handleFormat}
          variant="secondary"
          className="px-4 py-2 bg-green-600 text-white hover:bg-blue-700"
        >
          Format JSON
        </Button>
        <Button
          onClick={handleCopyLink}
          variant="secondary"
          size="icon"
          className="w-20 bg-blue-800 text-white hover:bg-blue-600"
        >
          <Share />
          Share
        </Button>
      </div>
    </div>
  );
}
