import { useState, useEffect } from "react";
import { useToolState } from "../../lib/useToolState";
import CodeEditor from "../../components/Editor";
import { Button } from "@/components/ui/button";
import { Copy, Download, Share } from "lucide-react";
import { optimize } from "svgo";
import { Helmet } from "react-helmet-async";

export default function SvgOptimizer() {
  const [svgInput, setSvgInput, getShareableUrl] = useToolState(
    "svg-optimizer",
    "",
    "data"
  );
  const [optimizedSvg, setOptimizedSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("preview");

  // Optimize SVG whenever input changes
  useEffect(() => {
    try {
      const result = optimize(svgInput, { multipass: true });
      setOptimizedSvg(result.data);
      setError(null);
    } catch (err: any) {
      setOptimizedSvg("");
      setError(err.message);
    }
  }, [svgInput]);

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedSvg);
    alert("Optimized SVG copied!");
  };

  const handleDownload = () => {
    const blob = new Blob([optimizedSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "optimized.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareableUrl());
    alert("Link copied to clipboard!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Helmet>
        <title>SVG Optimizer | DevBox</title>
        <meta
          name="description"
          content="Minify and optimize SVG files for better performance. Free online tool for designers and developers."
        />
        <meta
          name="keywords"
          content="SVG optimizer, SVG minifier, online SVG tool, optimize SVG"
        />

        {/* Open Graph */}
        <meta property="og:title" content="SVG Optimizer | DevBox" />
        <meta
          property="og:description"
          content="Free online tool to optimize and minify SVG files for better performance."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://devbox-gamma.vercel.app/workspace/svg-optimizer"
        />
        <meta
          property="og:image"
          content="https://devbox-gamma.vercel.app/preview-svg.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SVG Optimizer | DevBox" />
        <meta
          name="twitter:description"
          content="Optimize SVG files online for faster loading and smaller file size."
        />
        <meta
          name="twitter:image"
          content="https://devbox-gamma.vercel.app/preview-svg.png"
        />

        {/* Canonical */}
        <link
          rel="canonical"
          href="https://devbox-gamma.vercel.app/workspace/svg-optimizer"
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "SVG Optimizer",
            applicationCategory: "DeveloperTool",
            operatingSystem: "Web",
            description:
              "Online SVG optimizer to minify and improve performance of SVG files.",
            url: "https://devbox-gamma.vercel.app/workspace/svg-optimizer",
          })}
        </script>
      </Helmet>

      <h2 className="text-2xl font-semibold mb-4">SVG Optimizer</h2>

      <div className="mb-4">
        <label className="font-semibold">SVG Code</label>
        <CodeEditor value={svgInput} onChange={setSvgInput} language="xml" />
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {optimizedSvg && (
        <div className="mt-4">
          {/* Tabs */}
          <div className="flex border-b mb-2">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-2 text-lg font-semibold transition ${
                activeTab === "preview"
                  ? "text-blue-500 border-b-2 border-blue-600"
                  : "text-gray-400"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-4 py-2 text-lg font-semibold transition ${
                activeTab === "code"
                  ? "text-blue-500 border-b-2 border-blue-600"
                  : "text-gray-400"
              }`}
            >
              Optimized SVG Code
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "code" ? (
            <div>
              <CodeEditor
                value={optimizedSvg}
                onChange={setOptimizedSvg}
                language="xml"
              />
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  size="icon"
                  className="size-8"
                >
                  <Download />
                </Button>
              </div>
            </div>
          ) : (
            <div className="border rounded p-4 mb-4 bg-gray-50 dark:bg-gray-900">
              <div dangerouslySetInnerHTML={{ __html: optimizedSvg }} />
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  size="icon"
                  className="size-8"
                >
                  <Download />
                </Button>
                <Button
                  onClick={handleCopy}
                  variant="secondary"
                  size="icon"
                  className="size-8"
                >
                  <Copy />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Share Button */}
      <Button
        onClick={handleCopyLink}
        variant="secondary"
        size="icon"
        className="w-20 bg-blue-800 text-white hover:bg-blue-600 mt-4"
      >
        <Share />
        Share
      </Button>

      {/* Related Tools Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Related Tools
        </h2>
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          Check out other handy tools in DevBox to make your development workflow faster and easier:
        </p>
        <ul className="list-disc pl-5 text-blue-600 dark:text-blue-400 space-y-1">
          <li>
            <a href="/workspace/json-formatter" className="hover:underline">
              JSON Formatter
            </a>
          </li>
          <li>
            <a href="/workspace/regex-tester" className="hover:underline">
              Regex Tester
            </a>
          </li>
          <li>
            <a href="/workspace/color-converter" className="hover:underline">
              Color Converter
            </a>
          </li>
          <li>
            <a href="/workspace/curl-converter" className="hover:underline">
              Curl Converter
            </a>
          </li>
          <li>
            <a href="/workspace/base64-tool" className="hover:underline">
              Base64 Encoder/Decoder
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
