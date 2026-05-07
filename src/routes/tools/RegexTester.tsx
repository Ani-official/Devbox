import { useEffect, useState } from "react";
import { useToolState } from "../../lib/useToolState";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Share } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";

export default function RegexTester() {
  const [pattern, setPattern] = useToolState("regex-pattern", "", "pattern");
  const [flags, setFlags] = useToolState("regex-flags", "g", "flags");
  const [text, setText] = useToolState("regex-text", "", "text");
  const [highlighted, setHighlighted] = useState("");

  // Update highlighted output
  useEffect(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const result = text.replace(
        regex,
        (match) =>
          `<span class="bg-yellow-200 dark:bg-yellow-200 text-black rounded-sm transition duration-200">${match}</span>`
      );

      setHighlighted(result);
    } catch {
      setHighlighted(text); // fallback if invalid regex
    }
  }, [pattern, flags, text]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${
      window.location.pathname
    }?pattern=${encodeURIComponent(pattern)}&flags=${encodeURIComponent(
      flags
    )}&text=${encodeURIComponent(text)}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Helmet>
        <title>Regex Tester & Debugger | DevBox</title>
        <meta
          name="description"
          content="Test and debug regular expressions online with live highlighting. Validate patterns, test flags, and instantly see matches."
        />
        <meta
          name="keywords"
          content="regex tester, regular expression tester, regex debugger, online regex tool"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Regex Tester & Debugger | DevBox" />
        <meta
          property="og:description"
          content="Free online regex tester with live highlighting. Test patterns and flags, debug regular expressions easily."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://devbox-gamma.vercel.app/workspace/regex-tester"
        />
        <meta
          property="og:image"
          content="https://devbox-gamma.vercel.app/preview-regex.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Regex Tester & Debugger | DevBox" />
        <meta
          name="twitter:description"
          content="Test and debug regular expressions online with live highlighting. Free tool for developers."
        />
        <meta
          name="twitter:image"
          content="https://devbox-gamma.vercel.app/preview-regex.png"
        />

        {/* Canonical */}
        <link
          rel="canonical"
          href="https://devbox-gamma.vercel.app/workspace/regex-tester"
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Regex Tester",
            applicationCategory: "DeveloperTool",
            operatingSystem: "Web",
            description:
              "Online regex tester and debugger with live highlighting to test and debug regular expressions.",
            url: "https://devbox-gamma.vercel.app/workspace/regex-tester",
          })}
        </script>
      </Helmet>

      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Regex Tester & Debugger</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Enter a regular expression and test text to see live match highlighting. Debug patterns instantly without writing any code.
        </p>
      </header>
      <div className="space-y-4">
        <Card className="shadow-sm space-y-3 p-4">
          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="regex-pattern">Pattern</Label>
              <Input
                id="regex-pattern"
                placeholder="Enter regex pattern"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="mt-2"
              />
            </div>
            <div className="w-1/4 min-w-[100px]">
              <Label htmlFor="regex-flags">Flags</Label>
              <Input
                id="regex-flags"
                placeholder="g, i, m..."
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="regex-text">Text</Label>
            <Textarea
              id="regex-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text here"
              className="h-40 mt-2"
            />
          </div>

          <div className="p-4 border rounded text-gray-700 dark:text-gray-200 ">
            <Label>Matches</Label>
            <div
              className="mt-2 p-3 rounded-md border whitespace-pre-wrap font-mono bg-white/5 dark:bg-black/10"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        </Card>

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

      {/* Informational Content */}
      <section className="mt-10 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">How to Use the Regex Tester</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Enter your regular expression pattern in the <strong>Pattern</strong> field (without leading/trailing slashes).</li>
            <li>Set regex flags in the <strong>Flags</strong> field (e.g., <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">g</code> for global, <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">i</code> for case-insensitive).</li>
            <li>Paste or type your test text in the <strong>Text</strong> area.</li>
            <li>Matches are highlighted in yellow in real time as you type.</li>
            <li>Click <strong>Share</strong> to copy a URL with your pattern, flags, and text pre-filled.</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Regex Flags Explained</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">g</code> — <strong>Global</strong>: find all matches, not just the first one.</li>
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">i</code> — <strong>Case-insensitive</strong>: match uppercase and lowercase letters equally.</li>
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">m</code> — <strong>Multiline</strong>: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">^</code> and <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">$</code> match start/end of each line, not just the whole string.</li>
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">s</code> — <strong>Dotall</strong>: makes <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.</code> match newline characters too.</li>
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">u</code> — <strong>Unicode</strong>: enables full Unicode matching.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Common Regex Patterns</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Email address: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{"{2,}"}</code></li>
            <li>URL: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">https?:\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:/~+#]*)?</code></li>
            <li>IPv4 address: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">(\d{"{1,3}"}\.){"{3}"}\d{"{1,3}"}</code></li>
            <li>Date (YYYY-MM-DD): <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">\d{"{4}"}-\d{"{2}"}-\d{"{2}"}</code></li>
            <li>Hex color code: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">#([a-fA-F0-9]{"{6}"}|[a-fA-F0-9]{"{3}"})</code></li>
            <li>Phone number (US): <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">(\+1[\s\-]?)?\(?\d{"{3}"}\)?[\s\-]?\d{"{3}"}[\s\-]?\d{"{4}"}</code></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Related Tools</h2>
          <ul className="list-disc ml-6 text-blue-600 dark:text-blue-400 space-y-1">
            <li><a href="/workspace/json-formatter" className="hover:underline">JSON Formatter</a></li>
            <li><a href="/workspace/curl-converter" className="hover:underline">cURL Converter</a></li>
            <li><a href="/workspace/jwt-decoder" className="hover:underline">JWT Decoder</a></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
