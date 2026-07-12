import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import CodeEditor from "../../components/Editor";
import { useToolState } from "../../lib/useToolState";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { Helmet } from "@/lib/helmet";
import PageMeta from "../../components/PageMeta";

function curlToFetch(curl: string): string {
  if (!curl.trim().startsWith("curl")) return "// Invalid cURL command";

  const cmd = curl.trim().slice(5);
  const urlMatch =
    cmd.match(/'(https?:\/\/[^']+)'|"https?:\/\/[^"]+"/) ||
    cmd.match(/https?:\/\/\S+/);
  const url = urlMatch ? urlMatch[0].replace(/['"]/g, "") : "";

  const methodMatch = cmd.match(/-X (\w+)/);
  const method = methodMatch ? methodMatch[1] : "GET";

  const headers: Record<string, string> = {};
  const headerRegex = /-H '([^:]+):\s*([^']+)'|-H "([^:]+):\s*([^"]+)"/g;
  let match;
  while ((match = headerRegex.exec(cmd)) !== null) {
    const key = match[1] ?? match[3];
    const value = match[2] ?? match[4];
    headers[key] = value;
  }

  const dataMatch = cmd.match(
    /(?:--data-raw|--data-binary|--data|-d)\s+'([^']+)'|(?:--data-raw|--data-binary|--data|-d)\s+"([^"]+)"/
  );
  const body = dataMatch ? dataMatch[1] ?? dataMatch[2] : null;

  return `fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 2)}${body ? `,\n  body: ${JSON.stringify(body)}` : ""}
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);`;
}

function curlToAxios(curl: string): string {
  if (!curl.trim().startsWith("curl")) return "// Invalid cURL command";

  const cmd = curl.trim().slice(5);
  const urlMatch =
    cmd.match(/'(https?:\/\/[^']+)'|"https?:\/\/[^"]+"/) ||
    cmd.match(/https?:\/\/\S+/);
  const url = urlMatch ? urlMatch[0].replace(/['"]/g, "") : "";

  const methodMatch = cmd.match(/-X (\w+)/);
  const method = methodMatch ? methodMatch[1].toLowerCase() : "get";

  const headers: Record<string, string> = {};
  const headerRegex = /-H '([^:]+):\s*([^']+)'|-H "([^:]+):\s*([^"]+)"/g;
  let match;
  while ((match = headerRegex.exec(cmd)) !== null) {
    const key = match[1] ?? match[3];
    const value = match[2] ?? match[4];
    headers[key] = value;
  }

  const dataMatch = cmd.match(
    /(?:--data-raw|--data-binary|--data|-d)\s+'([^']+)'|(?:--data-raw|--data-binary|--data|-d)\s+"([^"]+)"/
  );
  const data = dataMatch ? dataMatch[1] ?? dataMatch[2] : null;

  let axiosCall = "";
  if (method === "get") {
    axiosCall = `axios.get("${url}", { headers: ${JSON.stringify(headers, null, 2)} })`;
  } else {
    axiosCall = data
      ? `axios.${method}("${url}", ${JSON.stringify(data)}, { headers: ${JSON.stringify(headers, null, 2)} })`
      : `axios.${method}("${url}", { headers: ${JSON.stringify(headers, null, 2)} })`;
  }

  return `import axios from "axios";

${axiosCall}
  .then(res => console.log(res.data))
  .catch(console.error);`;
}

export default function CurlConverter() {
  const [curlInput, setCurlInput, getShareableUrl] = useToolState(
    "devbox-curl-input",
    "",
    "curl"
  );
  const [fetchOutput, setFetchOutput] = useState("");
  const [axiosOutput, setAxiosOutput] = useState("");
  const [activeTab, setActiveTab] = useState("fetch");

  useEffect(() => {
    try {
      setFetchOutput(curlToFetch(curlInput));
      setAxiosOutput(curlToAxios(curlInput));
    } catch {
      setFetchOutput("// Invalid cURL command");
      setAxiosOutput("// Invalid cURL command");
    }
  }, [curlInput]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareableUrl());
    alert("Link copied to clipboard!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <PageMeta canonicalPath="/workspace/curl-converter" />
      <Helmet>
        <title>cURL to Fetch/Axios Converter | DevBox</title>
        <meta
          name="description"
          content="Convert cURL commands into Fetch or Axios code instantly. Test APIs and generate JavaScript code effortlessly."
        />
        <meta name="keywords" content="cURL converter, fetch converter, axios converter, API testing, online curl tool" />
        <meta property="og:title" content="cURL to Fetch/Axios Converter | DevBox" />
        <meta property="og:description" content="Free online tool to convert cURL commands to Fetch or Axios code for API testing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devbox-gamma.vercel.app/workspace/curl-converter" />
        <meta property="og:image" content="https://devbox-gamma.vercel.app/preview-curl.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="cURL to Fetch/Axios Converter | DevBox" />
        <meta name="twitter:description" content="Convert cURL commands into Fetch or Axios code online. Perfect for developers testing APIs." />
        <meta name="twitter:image" content="https://devbox-gamma.vercel.app/preview-curl.png" />
      </Helmet>

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <h1 className="text-3xl font-bold text-slate-950 dark:text-white">cURL Converter</h1>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
        Quickly convert cURL commands into <strong>Fetch</strong> or <strong>Axios</strong> JavaScript code.
        Ideal for API testing or integrating requests into your projects.
        </p>
      </div>

      {/* Editor */}
      <div className="mb-4">
        <label className="font-semibold">cURL Command</label>
        <CodeEditor value={curlInput} onChange={setCurlInput} language="shell" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-2 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("fetch")}
          className={`px-4 py-2 text-lg font-semibold transition ${
            activeTab === "fetch"
              ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Fetch
        </button>
        <button
          onClick={() => setActiveTab("axios")}
          className={`px-4 py-2 text-lg font-semibold transition ${
            activeTab === "axios"
              ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Axios
        </button>
      </div>

      {/* Output */}
      <div className="mb-4">
        <label className="font-semibold text-slate-900 dark:text-white">{activeTab} Output</label>
        <CodeEditor
          value={activeTab === "fetch" ? fetchOutput : axiosOutput}
          onChange={() => {}}
          readOnly
          language="javascript"
        />
      </div>

      <Button
        onClick={handleCopyLink}
        variant="secondary"
        size="icon"
        className="w-20 bg-blue-600 text-white hover:bg-blue-700 mb-6"
      >
        <Share /> Share
      </Button>

      {/* Tips Section */}
      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-2 text-slate-950 dark:text-white">Tips for Developers:</h2>
        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300">
          <li>Use Fetch for lightweight front-end requests.</li>
          <li>Use Axios for advanced requests with interceptors or automatic JSON parsing.</li>
          <li>Verify headers and body are correctly converted for POST/PUT requests.</li>
          <li>Test APIs locally before integrating into production code.</li>
        </ul>
      </div>

      {/* Related Tools */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-3 text-slate-950 dark:text-white">
          Related Tools
        </h2>
        <p className="mb-2 text-slate-600 dark:text-slate-300">
          Check out other handy tools in DevBox to make your development workflow faster and easier:
        </p>
        <ul className="list-disc pl-5 text-blue-600 dark:text-blue-400 space-y-1">
          <li>
            <Link to="/workspace/json-formatter" className="hover:underline">
              JSON Formatter
            </Link>
          </li>
          <li>
            <Link to="/workspace/regex-tester" className="hover:underline">
              Regex Tester
            </Link>
          </li>
          <li>
            <Link to="/workspace/color-converter" className="hover:underline">
              Color Converter
            </Link>
          </li>
          <li>
            <Link to="/workspace/svg-optimizer" className="hover:underline">
              SVG Optimizer
            </Link>
          </li>
          <li>
            <Link to="/workspace/base64-tool" className="hover:underline">
              Base64 Encoder/Decoder
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
