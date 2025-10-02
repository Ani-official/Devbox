import { useState, useEffect } from "react";
import CodeEditor from "../../components/Editor";
import { useToolState } from "../../lib/useToolState";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { Helmet } from "react-helmet-async";

function curlToFetch(curl: string): string {
  if (!curl.trim().startsWith("curl")) return "// Invalid cURL command";

  // Remove `curl ` prefix
  let cmd = curl.trim().slice(5);

  // Extract URL (single/double-quoted or unquoted fallback)
  const urlMatch =
    cmd.match(/'(https?:\/\/[^']+)'|"https?:\/\/[^"]+"/) ||
    cmd.match(/https?:\/\/\S+/);
  const url = urlMatch ? urlMatch[0].replace(/['"]/g, "") : "";

  // Extract method
  const methodMatch = cmd.match(/-X (\w+)/);
  const method = methodMatch ? methodMatch[1] : "GET";

  // Extract headers
  const headers: Record<string, string> = {};
  const headerRegex = /-H '([^:]+):\s*([^']+)'|-H "([^:]+):\s*([^"]+)"/g;
  let match;
  while ((match = headerRegex.exec(cmd)) !== null) {
    const key = match[1] ?? match[3];
    const value = match[2] ?? match[4];
    headers[key] = value;
  }

  // Extract data (-d / --data / --data-raw / --data-binary)
  const dataMatch = cmd.match(
    /(?:--data-raw|--data-binary|--data|-d)\s+'([^']+)'|(?:--data-raw|--data-binary|--data|-d)\s+"([^"]+)"/
  );
  const body = dataMatch ? dataMatch[1] ?? dataMatch[2] : null;

  // Build fetch string
  return `fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 2)}${body ? `,\n  body: ${JSON.stringify(body)}` : ""
    }
})
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);`;
}

function curlToAxios(curl: string): string {
  if (!curl.trim().startsWith("curl")) return "// Invalid cURL command";

  let cmd = curl.trim().slice(5);

  // Extract URL (single/double-quoted or unquoted fallback)
  const urlMatch =
    cmd.match(/'(https?:\/\/[^']+)'|"https?:\/\/[^"]+"/) ||
    cmd.match(/https?:\/\/\S+/);
  const url = urlMatch ? urlMatch[0].replace(/['"]/g, "") : "";

  // Extract method
  const methodMatch = cmd.match(/-X (\w+)/);
  const method = methodMatch ? methodMatch[1].toLowerCase() : "get";

  // Extract headers
  const headers: Record<string, string> = {};
  const headerRegex = /-H '([^:]+):\s*([^']+)'|-H "([^:]+):\s*([^"]+)"/g;
  let match;
  while ((match = headerRegex.exec(cmd)) !== null) {
    const key = match[1] ?? match[3];
    const value = match[2] ?? match[4];
    headers[key] = value;
  }

  // Extract data (-d / --data / --data-raw / --data-binary)
  const dataMatch = cmd.match(
    /(?:--data-raw|--data-binary|--data|-d)\s+'([^']+)'|(?:--data-raw|--data-binary|--data|-d)\s+"([^"]+)"/
  );
  const data = dataMatch ? dataMatch[1] ?? dataMatch[2] : null;

  // Build axios call string safely as one returned string
  let axiosCall = "";
  if (method === "get") {
    axiosCall = `axios.get("${url}", { headers: ${JSON.stringify(
      headers,
      null,
      2
    )} })`;
  } else {
    // For non-GET, include data argument if present
    if (data) {
      axiosCall = `axios.${method}("${url}", ${JSON.stringify(
        data
      )}, { headers: ${JSON.stringify(headers, null, 2)} })`;
    } else {
      axiosCall = `axios.${method}("${url}", { headers: ${JSON.stringify(
        headers,
        null,
        2
      )} })`;
    }
  }

  return `import axios from "axios";

${axiosCall}
  .then(res => console.log(res.data))
  .catch(console.error);`;
}

export default function CurlConverter() {
  // cURL input state persisted in localStorage and URL
  const [curlInput, setCurlInput, getShareableUrl] = useToolState(
    "devbox-curl-input",
    "",
    "curl"
  );

  const [fetchOutput, setFetchOutput] = useState("");
  const [axiosOutput, setAxiosOutput] = useState("");
  const [activeTab, setActiveTab] = useState("fetch");

  // Convert cURL to fetch & axios whenever input changes
  useEffect(() => {
    try {
      setFetchOutput(curlToFetch(curlInput));
      setAxiosOutput(curlToAxios(curlInput));
    } catch (err) {
      setFetchOutput("// Invalid cURL command");
      setAxiosOutput("// Invalid cURL command");
    }
  }, [curlInput]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareableUrl());
    alert("Link copied to clipboard!");
  };

  return (
    <div>
      <Helmet>
        <title>cURL to Fetch/Axios Converter | DevBox</title>
        <meta
          name="description"
          content="Convert cURL commands into Fetch or Axios code instantly. Test APIs and generate JavaScript code effortlessly."
        />
        <meta name="keywords" content="cURL converter, fetch converter, axios converter, API testing, online curl tool" />

        {/* Open Graph */}
        <meta property="og:title" content="cURL to Fetch/Axios Converter | DevBox" />
        <meta property="og:description" content="Free online tool to convert cURL commands to Fetch or Axios code for API testing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://devbox-gamma.vercel.app/workspace/curl-converter" />
        <meta property="og:image" content="https://devbox-gamma.vercel.app/preview-curl.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="cURL to Fetch/Axios Converter | DevBox" />
        <meta name="twitter:description" content="Convert cURL commands into Fetch or Axios code online. Perfect for developers testing APIs." />
        <meta name="twitter:image" content="https://devbox-gamma.vercel.app/preview-curl.png" />

        {/* Canonical */}
        <link rel="canonical" href="https://devbox-gamma.vercel.app/workspace/curl-converter" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "cURL Converter",
            applicationCategory: "DeveloperTool",
            operatingSystem: "Web",
            description: "Online cURL to Fetch/Axios converter to quickly transform commands into JavaScript code.",
            url: "https://devbox-gamma.vercel.app/workspace/curl-converter"
          })}
        </script>
      </Helmet>


      <h2 className="text-2xl font-semibold mb-4">cURL Converter</h2>

      <div className="mb-4">
        <label className="font-semibold">cURL Command</label>
        <CodeEditor
          value={curlInput}
          onChange={setCurlInput}
          language="shell"
        />
      </div>

      <div className="flex border-b mb-2">
        <button
          onClick={() => setActiveTab("fetch")}
          className={`px-4 py-2 text-lg font-semibold transition ${activeTab === "fetch"
              ? "text-blue-500 border-b-2 border-blue-600"
              : "text-gray-400"
            }`}
        >
          Fetch
        </button>
        <button
          onClick={() => setActiveTab("axios")}
          className={`px-4 py-2 text-lg font-semibold transition ${activeTab === "axios"
              ? "text-blue-500 border-b-2 border-blue-600"
              : "text-gray-400"
            }`}
        >
          Axios
        </button>
      </div>

      <div className="mb-4">
        <label className="font-semibold">{activeTab} Output</label>
        <CodeEditor
          value={activeTab === "fetch" ? fetchOutput : axiosOutput}
          onChange={() => { }}
          readOnly
          language="javascript"
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
  );
}
