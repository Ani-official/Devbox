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
      <Helmet>
        <title>Color Converter | HEX, RGB, HSL Online Tool</title>
        <meta
          name="description"
          content="Free online color converter tool. Instantly convert HEX colors to RGB and HSL formats, copy values easily, and preview colors."
        />
        <meta property="og:title" content="Color Converter | HEX, RGB, HSL Tool" />
        <meta
          property="og:description"
          content="Convert HEX to RGB and HSL with ease using this free online color converter. Copy values instantly and preview colors live."
        />
        <meta property="og:type" content="website" />
      </Helmet>
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
    <div>
      <h2 className="text-2xl font-semibold mb-4">Color Converter</h2>
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            {/* Text input for hex */}
            <Input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#RRGGBB"
              className="flex-1"
            />

            {/* Native color picker */}
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
    </div>
  );
}
