import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToolState } from "@/lib/useToolState";
import { Helmet } from "react-helmet-async";

function hexToRgb(hex: string) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToHsl(hex: string) {
  const bigint = parseInt(hex.slice(1), 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%)`;
}

function CopyableValue({ label, value }: { label: string; value: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div>
      <div className="flex items-center justify-between bg-muted px-3 py-2 rounded-lg">
        <span className="text-sm font-mono">
          {label}: {value}
        </span>
        <Button
          size="icon"
          variant="ghost"
          onClick={copyToClipboard}
          title="Copy"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function ColorConverter() {
  const [color, setColor] = useToolState("color-converter", "#ff0000");

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Helmet>
        <title>Color Converter | DevBox</title>
        <meta
          name="description"
          content="Convert colors between HEX, RGB, HSL, and other formats instantly. Free online tool for designers and developers."
        />
        <meta
          name="keywords"
          content="color converter, HEX to RGB, RGB to HSL, online color tool, color formats"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Color Converter | DevBox" />
        <meta
          property="og:description"
          content="Online tool to convert colors between HEX, RGB, HSL, and more."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://devbox-gamma.vercel.app/workspace/color-converter"
        />
        <meta
          property="og:image"
          content="https://devbox-gamma.vercel.app/preview-color.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Color Converter | DevBox" />
        <meta
          name="twitter:description"
          content="Convert colors easily online. HEX, RGB, HSL, and more."
        />
        <meta
          name="twitter:image"
          content="https://devbox-gamma.vercel.app/preview-color.png"
        />

        {/* Canonical */}
        <link
          rel="canonical"
          href="https://devbox-gamma.vercel.app/workspace/color-converter"
        />
      </Helmet>

      <h1 className="text-3xl font-bold mb-4">Color Converter</h1>

      {/* Short description */}
      <p className="mb-4 text-gray-700">
        Quickly convert between <strong>HEX</strong>, <strong>RGB</strong>, and{" "}
        <strong>HSL</strong> color formats. This tool is part of DevBox, a suite
        of handy developer utilities designed to simplify your workflow.
      </p>

      {/* Examples section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-2">Why use this tool?</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Get color codes ready for CSS, JavaScript, or design tools.</li>
          <li>Ensure your website colors are consistent across formats.</li>
          <li>Quickly pick colors and copy them for projects in Figma, Photoshop, or Illustrator.</li>
        </ul>
      </div>

      {/* Main tool card */}
      <Card className="w-full max-w-lg mx-auto mb-6">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#RRGGBB"
              className="flex-1"
            />
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-12 border rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <CopyableValue label="HEX" value={color} />
            <CopyableValue label="RGB" value={hexToRgb(color)} />
            <CopyableValue label="HSL" value={hexToHsl(color)} />
          </div>
        </CardContent>
      </Card>

      {/* Additional tips */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Tips for Developers:</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Use HSL for smooth color transitions in CSS animations.</li>
          <li>Check color contrast for accessibility using HEX or RGB values.</li>
          <li>Combine this tool with other DevBox utilities like Gradient Generator or Palette Picker for faster workflow.</li>
        </ul>
      </div>

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
            <a href="/workspace/curl-converter" className="hover:underline">
              Curl Converter
            </a>
          </li>
          <li>
            <a href="/workspace/svg-optimizer" className="hover:underline">
              SVG Optimizer
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
