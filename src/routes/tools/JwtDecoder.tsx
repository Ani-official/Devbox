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
        <title>JWT Decoder | DevBox</title>
        <meta
          name="description"
          content="Decode and verify JSON Web Tokens (JWT) with ease."
        />
      </Helmet>
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">JWT Decoder</h1>
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
    </div>
  );
}
