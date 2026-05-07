import { useEffect } from "react";
import { useToolState } from "../../lib/useToolState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

function decodeJWT(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid JWT format");

    const decode = (str: string) => {
      const padded = str.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = atob(padded);
      return JSON.parse(decoded);
    };

    const header = decode(parts[0]);
    const payload = decode(parts[1]);
    const signature = parts[2];

    return { header, payload, signature, error: null };
  } catch (err: any) {
    return { header: null, payload: null, signature: null, error: err.message };
  }
}

export default function JwtDecoder() {
  const [input, setInput] = useToolState("jwtDecoder_input", "", "jwt");
  const [output, setOutput] = useToolState("jwtDecoder_output", "");

  useEffect(() => {
    if (input.trim()) {
      const result = decodeJWT(input.trim());
      if (result.error) {
        setOutput(JSON.stringify({ error: result.error }, null, 2));
      } else {
        setOutput(
          JSON.stringify(
            {
              header: result.header,
              payload: result.payload,
              signature: result.signature,
            },
            null,
            2
          )
        );
      }
    } else {
      setOutput("");
    }
  }, [input]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <Helmet>
        <title>JWT Decoder & Inspector | DevBox</title>
        <meta
          name="description"
          content="Free online JWT decoder. Paste any JSON Web Token to instantly inspect its header, payload, and signature. No login required — 100% client-side."
        />
        <meta
          name="keywords"
          content="JWT decoder, JSON Web Token decoder, JWT inspector, decode JWT online, JWT header payload"
        />
        <meta property="og:title" content="JWT Decoder & Inspector | DevBox" />
        <meta
          property="og:description"
          content="Decode and inspect JSON Web Tokens (JWT) instantly. View header, payload, and signature in a clean readable format."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://devbox-gamma.vercel.app/workspace/jwt-decoder"
        />
        <link
          rel="canonical"
          href="https://devbox-gamma.vercel.app/workspace/jwt-decoder"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "JWT Decoder",
            applicationCategory: "DeveloperTool",
            operatingSystem: "Web",
            description:
              "Free online JSON Web Token (JWT) decoder. Inspect header, payload, and signature instantly.",
            url: "https://devbox-gamma.vercel.app/workspace/jwt-decoder",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          })}
        </script>
      </Helmet>
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">JWT Decoder & Inspector</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Paste a JSON Web Token below to instantly decode and inspect its header, payload, and signature.
        </p>
      </header>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 md:grid-cols-2"
      >
        {/* Input */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>JWT Token</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JWT token here..."
              className="bg-gray-900 text-blue-400 rounded-md min h-[500px] font-mono text-sm focus:outline-none focus-visible:ring-0"
            />
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="shadow-sm relative">
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Decoded Result</CardTitle>
            {output && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(output)}
                className="gap-2"
              >
                <Copy size={14} /> Copy
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <SyntaxHighlighter
              language="json"
              style={dracula}
              wrapLongLines
              className="bg-gray-800 h-[500px] overflow-auto rounded-md font-mono text-sm whitespace-pre-wrap break-words"
            >
              {output ? output : "Decoded result will appear here..."}
            </SyntaxHighlighter>
          </CardContent>
        </Card>
      </motion.div>

      {/* Informational Content */}
      <section className="mt-10 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">How to Use the JWT Decoder</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Paste your full JWT token into the input field on the left.</li>
            <li>The decoder automatically splits the token into its three parts: header, payload, and signature.</li>
            <li>View the decoded JSON in the output panel on the right.</li>
            <li>Click <strong>Copy</strong> to copy the decoded result to your clipboard.</li>
          </ol>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">What is a JSON Web Token (JWT)?</h2>
          <p>
            A JSON Web Token (JWT) is a compact, URL-safe token format used to securely transmit information between
            parties as a JSON object. JWTs are commonly used for authentication and authorization in web applications
            and REST APIs.
          </p>
          <p className="mt-2">
            A JWT consists of three Base64URL-encoded parts separated by dots (<code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">.</code>):
          </p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li><strong>Header</strong> — specifies the token type (<code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">JWT</code>) and the signing algorithm (e.g., <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">HS256</code>, <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">RS256</code>).</li>
            <li><strong>Payload</strong> — contains claims: data like user ID, roles, expiration time (<code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">exp</code>), issued-at time (<code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">iat</code>), and custom fields.</li>
            <li><strong>Signature</strong> — used to verify the token hasn't been tampered with. It is computed by signing the encoded header and payload with a secret or private key.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Common JWT Payload Claims</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">sub</code> — Subject: identifies the user or entity the token refers to.</li>
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">iss</code> — Issuer: the server or service that created the token.</li>
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">exp</code> — Expiration time: Unix timestamp after which the token is invalid.</li>
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">iat</code> — Issued at: Unix timestamp when the token was created.</li>
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">aud</code> — Audience: intended recipients of the token.</li>
            <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">roles</code> / <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">scope</code> — Custom claims for authorization (not standardized).</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Security Note</h2>
          <p>
            This decoder runs entirely in your browser — no token data is sent to any server. However, never paste
            production tokens containing sensitive data into any public online tool. Use this tool for debugging
            tokens in development environments only.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Related Tools</h2>
          <ul className="list-disc ml-6 text-blue-600 dark:text-blue-400 space-y-1">
            <li><a href="/workspace/json-formatter" className="hover:underline">JSON Formatter</a></li>
            <li><a href="/workspace/base64-tool" className="hover:underline">Base64 Encoder / Decoder</a></li>
            <li><a href="/workspace/curl-converter" className="hover:underline">cURL Converter</a></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
