import { useState, useEffect } from "react";
import CodeEditor from "../../components/Editor";
import { useToolState } from "../../lib/useToolState";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function Base64Tool() {
  const [input, setInput, getShareableUrl] = useToolState(
    "devbox-base64-input",
    "",
    "base64"
  );
  const [encoded, setEncoded] = useState("");
  const [decoded, setDecoded] = useState("");

  useEffect(() => {
    if (!input) {
      setEncoded("");
      setDecoded("");
      return;
    }

    // Encode
    try {
      setEncoded(btoa(input));
    } catch {
      setEncoded("// Cannot encode input");
    }

    // Decode
    try {
      const decodedValue = atob(input).replace(/[\r\n]+$/, "");
      setDecoded(decodedValue);
    } catch {
      setDecoded("// Invalid Base64 input");
    }
  }, [input]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareableUrl());
    alert("Link copied to clipboard!");
  };

  return (
    <div>
      <Helmet>
        <title>Base64 Encoder/Decoder | DevBox</title>
        <meta
          name="description"
          content="Encode and decode Base64 strings quickly and safely. Free online tool for developers."
        />
        <meta name="keywords" content="Base64 encoder, Base64 decoder, online Base64 tool, encode decode Base64" />

        {/* Open Graph */}
        <meta property="og:title" content="Base64 Encoder/Decoder | DevBox" />
        <meta property="og:description" content="Free online Base64 encoder and decoder. Encode or decode strings safely." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devbox-gamma.vercel.app/workspace/base64-tool" />
        <meta property="og:image" content="https://devbox-gamma.vercel.app/preview-base64.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Base64 Encoder/Decoder | DevBox" />
        <meta name="twitter:description" content="Encode and decode Base64 strings online with DevBox's free tool." />
        <meta name="twitter:image" content="https://devbox-gamma.vercel.app/preview-base64.png" />

        {/* Canonical */}
        <link rel="canonical" href="https://devbox-gamma.vercel.app/workspace/base64-tool" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Base64 Tool",
            applicationCategory: "DeveloperTool",
            operatingSystem: "Web",
            description: "Online Base64 encoder and decoder for strings and data.",
            url: "https://devbox-gamma.vercel.app/workspace/base64-tool"
          })}
        </script>
      </Helmet>

      <h2 className="text-2xl font-semibold mb-4">Base64 Encoder / Decoder</h2>

      {/* Responsive editors: stack on small screens, side-by-side on md+ */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="font-semibold">Input</label>
          <CodeEditor value={input} onChange={setInput} language="text" />
        </div>

        <div className="flex-1">
          <label className="font-semibold">Encoded (Base64)</label>
          <CodeEditor value={encoded} onChange={() => { }} readOnly language="text" />
        </div>

        <div className="flex-1">
          <label className="font-semibold">Decoded (UTF-8)</label>
          <CodeEditor value={decoded} onChange={() => { }} readOnly language="text" />
        </div>
      </div>

      <Button onClick={handleCopyLink} variant="secondary" size="icon" className="w-20 bg-blue-800 text-white hover:bg-blue-600">
        <Share />Share
      </Button>
    </div>
  );
}
