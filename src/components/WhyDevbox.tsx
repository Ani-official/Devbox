import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import CodeEditor from "../components/Editor"; 
import { Play, Repeat } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
import {
  dracula,
} from "react-syntax-highlighter/dist/esm/styles/hljs";


export default function WhyDevBoxAdvanced() {
  return (
    <section className="w-full max-w-6xl mx-auto py-20 px-6">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10 font-anton">
        Why <span className="text-blue-600 dark:text-blue-400">DevBox?</span>
      </h2>

      <div className="flex flex-col gap-28">
        {/* Feature 1: JSON formatting w/ morph & gradient blob */}
        <FeatureRow
          title="Instant JSON Formatting"
          desc="Paste messy JSON and watch it transform into clean, readable output. One-click copy for configs, CI, and quick fixes."
          reverse={false}
        >
          <div className="relative p-3 rounded-2xl overflow-hidden">
            {/* gradient blob behind */}
            <motion.div
              className="absolute -inset-6 rounded-3xl opacity-40"
              style={{
                background:
                  "linear-gradient(120deg, rgba(72,187,120,0.08), rgba(234,197,75,0.06), rgba(120,144,255,0.04))",
                filter: "blur(28px)",
              }}
              animate={{ rotate: [0, 3, -2, 0] }}
              transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
            />

            <div className="relative z-10">
              <JsonMorphPreview />
            </div>
          </div>
        </FeatureRow>

        {/* Feature 2: Regex interactive + highlight */}
        <FeatureRow
          title="Regex Testing — Visual & Interactive"
          desc="Type a pattern and see matches highlight instantly. Build, test, and iterate faster with immediate feedback."
          reverse={true}
        >
          <div className="relative p-4 rounded-2xl overflow-hidden">
            <motion.div
              className="absolute -inset-5 rounded-3xl opacity-30"
              style={{
                background:
                  "linear-gradient(120deg, rgba(99,102,241,0.06), rgba(236,72,153,0.03))",
                filter: "blur(18px)",
              }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            />
            <div className="relative z-10">
              <RegexInteractive />
            </div>
          </div>
        </FeatureRow>

        {/* Feature 3: cURL -> fetch animation + typing */}
        <FeatureRow
          title="Convert cURL to Clean Code"
          desc="Paste a cURL and get ready-to-use Fetch or Axios code with a click — perfect for quickly using API examples."
          reverse={false}
        >
          <div className="relative p-4 rounded-2xl overflow-hidden">
            <motion.div
              className="absolute -inset-6 rounded-3xl opacity-30"
              style={{
                background:
                  "linear-gradient(120deg, rgba(14,165,233,0.05), rgba(34,197,94,0.03))",
                filter: "blur(20px)",
              }}
              animate={{ x: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            />
            <div className="relative z-10">
              <CurlToFetchPreview />
            </div>
          </div>
        </FeatureRow>
      </div>
    </section>
  );
}

/* ---------- FeatureRow wrapper ---------- */
function FeatureRow({
  title,
  desc,
  children,
  reverse,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className={`flex flex-col md:flex-row items-center gap-8 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <motion.div
        className="w-full md:w-1/2"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">{desc}</p>
      </motion.div>

      <motion.div
        className="w-full md:w-1/2"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/30 dark:bg-black/20 p-4 shadow-md">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- JsonMorphPreview: morph messy -> formatted JSON ---------- */
function JsonMorphPreview() {
  const messy = `{"name":"DevBox","config":{"env":"prod","logging":true,"features":["json","regex","curl","svg"]},"owner":"team"}`;
  const [formatted, setFormatted] = useState(() => pretty(messy));
  const [animating, setAnimating] = useState(false);

  // play morph animation every X seconds
  useEffect(() => {
    const id = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setFormatted((prev) =>
          prev === pretty(messy) ? pretty(messy) : pretty(messy)
        );
        setAnimating(false);
      }, 900);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/80 dark:bg-gray-800/60 flex items-center justify-center">
            <Play className="text-sky-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Preview
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Auto-format in action
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">Auto</div>
      </div>

      <motion.div
        layout
        initial={{ opacity: 1 }}
        animate={{ opacity: animating ? 0.5 : 1, scale: animating ? 0.997 : 1 }}
        transition={{ duration: 0.35 }}
        className="rounded-lg overflow-hidden border bg-gray-900 dark:bg-[#0b1220] p-2"
      >
        {/* Code editor (monaco) in read-only mode */}
        <CodeEditor
          value={formatted}
          onChange={() => {}}
          readOnly
          language="json"
        />
      </motion.div>
    </div>
  );
}

/* ---------- RegexInteractive: live input + highlighting + sample matches ---------- */
function escapeHtml(text: string) {
  return text.replace(/[&<>"'`=\/]/g, (s) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;",
    };
    return map[s] || s;
  });
}

function RegexInteractive() {
  const [pattern, setPattern] = useState<string>(
    "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
  );
  const [flags, setFlags] = useState<string>("g");
  const sample =
    "Emails: test@mail.com, hello@dev.io, not-an-email, contact@company.co.uk\nPhones: +1-555-1234";

  const highlighted = useMemo(() => {
    let regex: RegExp | null = null;
    try {
      regex = new RegExp(pattern, flags);
    } catch {
      return { html: escapeHtml(sample), error: true };
    }
    const parts = sample.split(regex);
    const matches = sample.match(regex) || [];
    // build highlighted HTML
    let html = "";
    for (let i = 0; i < parts.length; i++) {
      html += escapeHtml(parts[i]);
      if (i < matches.length) {
        const m = escapeHtml(matches[i]);
        html += `<span class="highlight-match">${m}</span>`;
      }
    }
    return { html, error: false };
  }, [pattern, flags]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <label className="text-xs text-gray-500">Pattern</label>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-white/5 dark:bg-black/10 text-sm"
            placeholder="Enter regex (no / / )"
          />
        </div>
        <div className="w-24">
          <label className="text-xs text-gray-500">Flags</label>
          <input
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-white/5 dark:bg-black/10 text-sm"
          />
        </div>
      </div>

      <div className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
        <div
          className={`whitespace-pre-wrap p-3 rounded-md border bg-zinc-800 text-white text-sm font-mono`}
          dangerouslySetInnerHTML={{ __html: highlighted.html }}
        />
        {highlighted.error && (
          <div className="mt-2 text-xs text-red-400">
            Invalid pattern — check the syntax.
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- CurlToFetchPreview: typing animation + mapping ---------- */
function CurlToFetchPreview() {
  const curlExample = `curl -X POST https://api.devbox.tools/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"dev","password":"secret"}'`;

  const fetchExample = `fetch("https://api.devbox.tools/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "dev", password: "secret" })
})`;

  const [typed, setTyped] = useState("");
  const [stage, setStage] = useState<"curl" | "arrow" | "fetch">("curl");

  // typing animation for curl then arrow then fetch
  useEffect(() => {
    let mounted = true;
    let i = 0;
    setStage("curl");
    setTyped("");
    const t1 = setInterval(() => {
      if (!mounted) return;
      i++;
      setTyped(curlExample.slice(0, i));
      if (i >= curlExample.length) {
        clearInterval(t1);
        setTimeout(() => {
          setStage("arrow");
          setTyped("→ converting …");
          setTimeout(() => {
            // type fetch
            setStage("fetch");
            let j = 0;
            setTyped("");
            const t2 = setInterval(() => {
              j++;
              setTyped(fetchExample.slice(0, j));
              if (j >= fetchExample.length) {
                clearInterval(t2);
              }
            }, 12);
          }, 700);
        }, 700);
      }
    }, 10);
    return () => {
      mounted = false;
      clearInterval(t1);
    };
  }, []);

  return (
    <div className="space-y-3 font-mono text-sm text-gray-900 dark:text-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-white/80 dark:bg-gray-800/60 flex items-center justify-center">
          <Repeat className="text-sky-600" />
        </div>
        <div className="text-xs text-gray-500">Live conversion</div>
      </div>
      <div className={`${stage === "curl" ? "text-indigo-400" : ""}`}>
        <SyntaxHighlighter
          wrapLongLines
          language="javascript"
          style={dracula}
          className="overflow-auto min-h-[120px] rounded-md border"
        >
          {typed}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

/* ---------- small util ---------- */
function pretty(jsonLike: string) {
  try {
    return JSON.stringify(JSON.parse(jsonLike), null, 2);
  } catch {
    return jsonLike;
  }
}
