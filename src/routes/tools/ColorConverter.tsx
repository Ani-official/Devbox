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
          aria-label={`Copy ${label} value`}
          title={`Copy ${label} value`}
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
    <div className="max-w-6xl mx-auto px-4 py-6">
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
      <p className="mb-4 dark:text-gray-300">
        Quickly convert between <strong>HEX</strong>, <strong>RGB</strong>, and{" "}
        <strong>HSL</strong> color formats. This tool is part of DevBox, a suite
        of handy developer utilities designed to simplify your workflow.
      </p>
      

      {/* Main tool card */}
      <Card className="w-full max-w-lg mx-auto mb-6">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <label htmlFor="hex-input" className="sr-only">HEX color value</label>
            <Input
              id="hex-input"
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#RRGGBB"
              className="flex-1"
              aria-label="HEX color value"
            />
            <label htmlFor="color-picker" className="sr-only">Color picker</label>
            <input
              id="color-picker"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-12 border rounded cursor-pointer"
              aria-label="Color picker"
              title="Pick a color"
            />
          </div>

          <div className="space-y-2">
            <CopyableValue label="HEX" value={color} />
            <CopyableValue label="RGB" value={hexToRgb(color)} />
            <CopyableValue label="HSL" value={hexToHsl(color)} />
          </div>
        </CardContent>
      </Card>

      {/* Informational Content */}
      <section className="mt-10 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">How to Use the Color Converter</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Click the color picker or type a HEX color value directly into the input field.</li>
            <li>The tool instantly shows the equivalent <strong>HEX</strong>, <strong>RGB</strong>, and <strong>HSL</strong> values.</li>
            <li>Click the <strong>Copy</strong> icon next to any format to copy that value to your clipboard.</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Color Format Comparison</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>HEX</strong> — A 6-digit hexadecimal representation used widely in HTML and CSS.
              Example: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">#3b82f6</code>
            </li>
            <li>
              <strong>RGB</strong> — Specifies red, green, and blue channel intensities from 0 to 255.
              Example: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">rgb(59, 130, 246)</code>
            </li>
            <li>
              <strong>HSL</strong> — Hue (0–360°), Saturation (0–100%), and Lightness (0–100%). More
              intuitive for designers when adjusting shades and tints.
              Example: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">hsl(217, 91%, 60%)</code>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">When to Use Each Format</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Use <strong>HEX</strong> for static design assets and when copy-pasting between design tools and code.</li>
            <li>Use <strong>RGB</strong> when you need to manipulate color channels programmatically or apply opacity with <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">rgba()</code>.</li>
            <li>Use <strong>HSL</strong> when building color palettes or theming systems — it's easier to create lighter/darker variants by adjusting lightness.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Related Tools</h2>
          <ul className="list-disc ml-6 text-blue-600 dark:text-blue-400 space-y-1">
            <li><a href="/workspace/svg-optimizer" className="hover:underline">SVG Optimizer</a></li>
            <li><a href="/workspace/json-formatter" className="hover:underline">JSON Formatter</a></li>
            <li><a href="/workspace/base64-tool" className="hover:underline">Base64 Encoder / Decoder</a></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
