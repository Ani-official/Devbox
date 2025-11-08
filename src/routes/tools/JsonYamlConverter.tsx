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
        <title>JSON ⇄ YAML Converter | DevBox</title>
        <meta
          name="description"
          content="Instantly convert between JSON and YAML formats. Clean UI, persistent data, and downloadable output."
        />
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
    </div>
  );
}
