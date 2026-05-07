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

  const [encoded, setEncoded] = useState<string>("");
  const [decoded, setDecoded] = useState<string>("");

  useEffect(() => {
    if (!input) {
      setEncoded("");
      setDecoded("");
      return;
    }

    try {
      setEncoded(btoa(input));
    } catch {
      setEncoded("// Cannot encode input");
    }

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

  const handleExample = () => {
    setInput("Hello DevBox!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Helmet>
        <title>Base64 Encoder/Decoder | DevBox</title>
        <meta
          name="description"
          content="Encode and decode Base64 strings quickly and safely. Free online Base64 encoder and decoder tool for developers."
        />
        <meta
          name="keywords"
          content="Base64 encoder, Base64 decoder, Base64 tool, encode decode Base64, Base64 converter"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Base64 Encoder/Decoder | DevBox" />
        <meta
          property="og:description"
          content="Free online Base64 encoder and decoder. Encode or decode strings safely."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://devbox-gamma.vercel.app/workspace/base64-tool"
        />
        <meta
          property="og:image"
          content="https://devbox-gamma.vercel.app/preview-base64.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Base64 Encoder/Decoder | DevBox" />
        <meta
          name="twitter:description"
          content="Encode and decode Base64 strings online with DevBox's free tool."
        />
        <meta
          name="twitter:image"
          content="https://devbox-gamma.vercel.app/preview-base64.png"
        />

        {/* Canonical */}
        <link
          rel="canonical"
          href="https://devbox-gamma.vercel.app/workspace/base64-tool"
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Base64 Tool",
            applicationCategory: "DeveloperTool",
            operatingSystem: "Web",
            description:
              "Online Base64 encoder and decoder for strings and data.",
            url: "https://devbox-gamma.vercel.app/workspace/base64-tool",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          })}
        </script>
      </Helmet>

      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Base64 Encoder / Decoder
      </h1>

      {/* --- Example --- */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          onClick={handleExample}
          variant="secondary"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Try Example
        </Button>
      </div>

      {/* --- Editors Section --- */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="font-semibold">Input</label>
          <CodeEditor value={input} onChange={setInput} language="text" />
        </div>

        <div className="flex-1">
          <label className="font-semibold">Encoded (Base64)</label>
          <CodeEditor
            value={encoded}
            onChange={() => {}}
            readOnly
            language="text"
          />
        </div>

        <div className="flex-1">
          <label className="font-semibold">Decoded (UTF-8)</label>
          <CodeEditor
            value={decoded}
            onChange={() => {}}
            readOnly
            language="text"
          />
        </div>
      </div>
      <Button
        onClick={handleCopyLink}
        variant="secondary"
        size="icon"
        className="w-20 bg-blue-800 text-white hover:bg-blue-600"
      >
        <Share className="h-4 w-4" />
        Share
      </Button>

      {/* Informational Content */}
      <section className="mt-10 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">How to Use the Base64 Tool</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Type or paste text into the <strong>Input</strong> field on the left.</li>
            <li>The <strong>Encoded (Base64)</strong> panel shows your input encoded as a Base64 string instantly.</li>
            <li>The <strong>Decoded (UTF-8)</strong> panel shows the decoded text if you paste a valid Base64 string.</li>
            <li>Click <strong>Try Example</strong> to load a sample input and see the tool in action.</li>
            <li>Use <strong>Share</strong> to copy a link with your current input pre-filled.</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">What is Base64?</h2>
          <p>
            Base64 is a binary-to-text encoding scheme that represents binary data using a set of 64 printable
            ASCII characters (A–Z, a–z, 0–9, <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">+</code>, and <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">/</code>). It is widely used to safely
            transmit binary data over systems that only support plain text, such as email (MIME), HTTP headers,
            and JSON payloads.
          </p>
          <p className="mt-2">
            Base64 encoding increases the size of the data by approximately 33%, but ensures that the content
            survives transmission through text-only channels without corruption.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Common Use Cases</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Encoding images or binary files to embed directly in HTML, CSS, or JSON.</li>
            <li>Transmitting data in JWT tokens (the header and payload sections are Base64URL-encoded).</li>
            <li>Encoding credentials in HTTP Basic Authentication headers.</li>
            <li>Storing binary data in databases or configuration files that only support text.</li>
            <li>Encoding email attachments in the MIME standard.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Related Tools</h2>
          <ul className="list-disc ml-6 text-blue-600 dark:text-blue-400 space-y-1">
            <li><a href="/workspace/json-formatter" className="hover:underline">JSON Formatter</a></li>
            <li><a href="/workspace/jwt-decoder" className="hover:underline">JWT Decoder</a></li>
            <li><a href="/workspace/curl-converter" className="hover:underline">cURL Converter</a></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
