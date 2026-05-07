import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Play, Trash2, Share } from "lucide-react";
import yaml from "js-yaml";
import { Helmet } from "react-helmet-async";
import CodeEditor from "../../components/Editor";
import { useToolState } from "../../lib/useToolState";

export default function JsonYamlConverter() {
  const [mode, setMode] = useToolState("jsonYaml_mode", "json-to-yaml", "mode");
  const [input, setInput, getShareableUrl] = useToolState(
    "jsonYaml_input",
    "",
    "input"
  );
  const [output, setOutput] = useToolState("jsonYaml_output", "");
  const [error, setError] = useState<string>("");

  const handleConvert = () => {
    setError("");
    try {
      if (mode === "json-to-yaml") {
        const jsonObj = JSON.parse(input);
        const yamlStr = yaml.dump(jsonObj);
        setOutput(yamlStr);
      } else {
        const yamlObj = yaml.load(input);
        const jsonStr = JSON.stringify(yamlObj, null, 2);
        setOutput(jsonStr);
      }
    } catch (err: any) {
      setError(err.message || "Invalid input format");
      setOutput("");
    }
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareableUrl());
    alert("Link copied to clipboard!");
  };

  const switchMode = () => {
    const newMode = mode === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml";
    setMode(newMode);
    setInput("");
    setOutput("");
    setError("");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <Helmet>
        <title>JSON to YAML Converter (and YAML to JSON) | DevBox</title>
        <meta
          name="description"
          content="Free online JSON to YAML converter and YAML to JSON converter. Paste your data and get an instant, accurate conversion with syntax highlighting."
        />
        <meta
          name="keywords"
          content="JSON to YAML, YAML to JSON, convert JSON YAML, JSON YAML converter online, developer tools"
        />
        <meta property="og:title" content="JSON ⇄ YAML Converter | DevBox" />
        <meta
          property="og:description"
          content="Convert between JSON and YAML formats instantly. Free online tool for developers."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://devbox-gamma.vercel.app/workspace/json-yaml-converter"
        />
        <link
          rel="canonical"
          href="https://devbox-gamma.vercel.app/workspace/json-yaml-converter"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "JSON ⇄ YAML Converter",
            applicationCategory: "DeveloperTool",
            operatingSystem: "Web",
            description:
              "Free online tool to convert between JSON and YAML formats instantly.",
            url: "https://devbox-gamma.vercel.app/workspace/json-yaml-converter",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          })}
        </script>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          JSON ⇄ YAML Converter
        </h1>
        <Button onClick={switchMode} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Switch to {mode === "json-to-yaml" ? "YAML → JSON" : "JSON → YAML"}
        </Button>
      </div>

      {/* Input/Output */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              {mode === "json-to-yaml" ? "JSON Input" : "YAML Input"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodeEditor
              value={input}
              onChange={setInput}
              language={mode === "json-to-yaml" ? "json" : "yaml"}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 break-all">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              {mode === "json-to-yaml" ? "YAML Output" : "JSON Output"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodeEditor
              value={output}
              onChange={() => {}}
              readOnly
              language={mode === "json-to-yaml" ? "yaml" : "json"}
            />
          </CardContent>
        </Card>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between items-center mt-6">
        {/* Left side buttons */}
        <div className="flex gap-3">
          <Button
            size="icon"
            onClick={handleConvert}
            className="w-23 gap-2 bg-green-600 text-white hover:bg-green-700"
          >
            <Play className="w-4 h-4" /> Convert
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

        {/* Right side button */}
        <Button variant="secondary" onClick={clearAll} className="gap-2">
          <Trash2 className="w-4 h-4" /> Reset
        </Button>
      </div>

      {/* Informational Content */}
      <section className="mt-10 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">How to Use the JSON ⇄ YAML Converter</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Choose direction: <strong>JSON → YAML</strong> or <strong>YAML → JSON</strong> using the Switch button.</li>
            <li>Paste your input into the left editor panel.</li>
            <li>Click <strong>Convert</strong> to see the output on the right.</li>
            <li>Use <strong>Reset</strong> to clear both panels and start fresh.</li>
            <li>Click <strong>Share</strong> to copy a link with your current input pre-filled.</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">JSON vs YAML — Key Differences</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>JSON (JavaScript Object Notation)</strong> — uses curly braces, quotes around keys, and explicit
              commas. Universally supported by APIs, databases, and programming languages. Strict syntax.
            </li>
            <li>
              <strong>YAML (YAML Ain't Markup Language)</strong> — uses indentation instead of braces, no quotes required
              for most strings. More human-readable and commonly used in configuration files (Docker Compose, Kubernetes,
              GitHub Actions, Ansible).
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">When to Use Each Format</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Use <strong>JSON</strong> for REST APIs, request/response payloads, and data exchange between services.</li>
            <li>Use <strong>YAML</strong> for configuration files, CI/CD pipelines, and infrastructure-as-code tools where human readability matters.</li>
            <li>Convert <strong>JSON → YAML</strong> when migrating API responses into config files or Helm charts.</li>
            <li>Convert <strong>YAML → JSON</strong> when your API or tool requires JSON input and you only have a YAML config.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Related Tools</h2>
          <ul className="list-disc ml-6 text-blue-600 dark:text-blue-400 space-y-1">
            <li><a href="/workspace/json-formatter" className="hover:underline">JSON Formatter & Validator</a></li>
            <li><a href="/workspace/curl-converter" className="hover:underline">cURL Converter</a></li>
            <li><a href="/workspace/jwt-decoder" className="hover:underline">JWT Decoder</a></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
