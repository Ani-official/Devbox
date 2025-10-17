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
    <div className="max-w-4xl mx-auto px-4 py-6">
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
        <meta
          name="twitter:title"
          content="Base64 Encoder/Decoder | DevBox"
        />
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

      {/* --- Intro Section --- */}
      <section className="mb-6 text-gray-700 dark:text-gray-300">
        <p>
          The <strong>Base64 Encoder/Decoder</strong> lets you quickly convert
          text or data to and from Base64 format. Base64 encoding is commonly
          used to safely transfer or embed data such as images, files, or
          authentication tokens.
        </p>
        <p className="mt-2">
          Paste your text in the input box below, and the tool will instantly
          show both the encoded and decoded versions. Everything happens
          directly in your browser — no data leaves your device.
        </p>
      </section>

      {/* --- Example + Share --- */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          onClick={handleExample}
          variant="default"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Try Example
        </Button>

        <Button
          onClick={handleCopyLink}
          variant="secondary"
          size="icon"
          className="w-20 bg-blue-800 text-white hover:bg-blue-600"
        >
          <Share className="h-4 w-4" />
          Share
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

      {/* --- FAQ Section --- */}
      <section className="space-y-4 mb-8 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-semibold">What is Base64 Encoding?</h2>
        <p>
          Base64 encoding is a process that converts binary data (like images or
          files) into ASCII text using 64 characters (A-Z, a-z, 0-9, +, and /).
          It ensures data integrity during transmission over systems that only
          support text.
        </p>

        <h2 className="text-2xl font-semibold">Why Use Base64?</h2>
        <p>
          It’s used in web development, APIs, and emails to safely embed or
          transfer data. Examples include encoding images in HTML, storing
          credentials, or transmitting data in JSON objects.
        </p>

        <h2 className="text-2xl font-semibold">Is Base64 Secure?</h2>
        <p>
          No — Base64 is an encoding method, not encryption. It should never be
          used for securing data. For sensitive information, use encryption like
          AES or RSA instead.
        </p>
      </section>

      {/* --- Related Tools --- */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Related Tools
        </h2>
        <ul className="list-disc pl-5 text-blue-600 dark:text-blue-400 space-y-1">
          <li>
            <a href="/workspace/json-formatter">JSON Formatter</a>
          </li>
          <li>
            <a href="/workspace/regex-tester">Regex Tester</a>
          </li>
          <li>
            <a href="/workspace/curl-converter">Curl Converter</a>
          </li>
        </ul>
      </section>
    </div>
  );
}
