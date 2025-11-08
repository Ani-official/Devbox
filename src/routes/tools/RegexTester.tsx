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

      <h2 className="text-2xl font-semibold mb-4">Regex Tester</h2>
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

      {/* --- Explore More Tools Section --- */}
    </div>
  );
}
