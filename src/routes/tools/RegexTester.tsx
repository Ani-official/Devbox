import { useEffect, useState } from "react";
import { useToolState } from "../../lib/useToolState";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Share } from "lucide-react";
import { Helmet } from "react-helmet-async";

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
          `<mark class="bg-yellow-200 dark:bg-yellow-700">${match}</mark>`
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
    <div>
      <Helmet>
        <title>Online Regex Tester & Debugger | DevBox</title>
        <meta
          name="description"
          content="Test and debug regular expressions online with real-time highlighting. Try different regex patterns, flags, and instantly see matches on your text."
        />
        <meta
          property="og:title"
          content="Online Regex Tester & Debugger | DevBox"
        />
        <meta
          property="og:description"
          content="Free regex tester with live highlighting. Validate patterns, test flags, and debug regular expressions easily online."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <h2 className="text-2xl font-semibold mb-4">Regex Tester</h2>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="regex-pattern">Pattern</Label>
            <Input
              id="regex-pattern"
              placeholder="Enter regex pattern"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="w-1/4">
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

        <div className="p-4 border rounded bg-gray-50 dark:bg-gray-900">
          <Label>Matches</Label>
          <div
            className="mt-2 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>

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
