import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Repeat } from "lucide-react";

export default function WhyDevBoxAdvanced() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20">
      <h2 className="mb-10 text-center text-4xl font-black tracking-tight md:text-5xl">
        Why <span className="text-blue-600 dark:text-blue-400">DevBox?</span>
      </h2>

      <div className="flex flex-col gap-20">
        <FeatureRow
          title="Instant JSON Formatting"
          desc="Paste messy JSON and watch it transform into clean, readable output. One-click copy for configs, CI, and quick fixes."
          reverse={false}
        >
          <div className="relative overflow-hidden rounded-2xl p-3">
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

        <FeatureRow
          title="Regex Testing — Visual & Interactive"
          desc="Type a pattern and see matches highlight instantly. Build, test, and iterate faster with immediate feedback."
          reverse
        >
          <div className="relative overflow-hidden rounded-2xl p-4">
            <motion.div
              className="absolute -inset-5 rounded-3xl opacity-30"
              style={{
                background: "linear-gradient(120deg, rgba(99,102,241,0.06), rgba(236,72,153,0.03))",
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

        <FeatureRow
          title="Convert cURL to Clean Code"
          desc="Paste a cURL and get ready-to-use Fetch or Axios code with a click — perfect for quickly using API examples."
          reverse={false}
        >
          <div className="relative overflow-hidden rounded-2xl p-4">
            <motion.div
              className="absolute -inset-6 rounded-3xl opacity-30"
              style={{
                background: "linear-gradient(120deg, rgba(14,165,233,0.05), rgba(34,197,94,0.03))",
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

function FeatureRow({
  title,
  desc,
  children,
  reverse,
}: {
  title: string;
  desc: string;
  children: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center gap-8 ${reverse ? "md:flex-row-reverse" : "md:flex-row"}`}>
      <motion.div
        className="w-full md:w-1/2"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="mb-3 text-2xl font-semibold text-slate-950 dark:text-white">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300">{desc}</p>
      </motion.div>

      <motion.div
        className="w-full md:w-1/2"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function JsonMorphPreview() {
  const messy = `{"name":"DevBox","config":{"env":"prod","logging":true,"features":["json","regex","curl","svg"]},"owner":"team"}`;
  const [formatted, setFormatted] = useState(() => pretty(messy));
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setFormatted(pretty(messy));
        setAnimating(false);
      }, 900);
    }, 8000);

    return () => clearInterval(id);
  }, [messy]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sky-600 dark:bg-slate-800/70">
            <Play className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Preview</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Auto-format in action</div>
          </div>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">Auto</div>
      </div>

      <motion.div
        layout
        initial={{ opacity: 1 }}
        animate={{ opacity: animating ? 0.5 : 1, scale: animating ? 0.997 : 1 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
      >
        <pre className="min-h-[160px] overflow-auto rounded-md bg-slate-950 p-4 font-mono text-[13px] text-slate-100">
          <code>{formatted}</code>
        </pre>
      </motion.div>
    </div>
  );
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"'`=/]/g, (character) => {
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
    return map[character] || character;
  });
}

function RegexInteractive() {
  const [pattern, setPattern] = useState<string>("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
  const [flags, setFlags] = useState<string>("g");
  const sample = "Emails: test@mail.com, hello@dev.io, not-an-email, contact@company.co.uk\nPhones: +1-555-1234";

  const highlighted = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const parts = sample.split(regex);
      const matches = sample.match(regex) || [];

      let html = "";
      for (let index = 0; index < parts.length; index += 1) {
        html += escapeHtml(parts[index]);
        if (index < matches.length) {
          html += `<span class="highlight-match">${escapeHtml(matches[index])}</span>`;
        }
      }

      return { html, error: false };
    } catch {
      return { html: escapeHtml(sample), error: true };
    }
  }, [pattern, flags]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label htmlFor="why-regex-pattern" className="text-xs text-slate-500 dark:text-slate-400">
            Pattern
          </label>
          <input
            id="why-regex-pattern"
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white/90 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100"
            placeholder="Enter regex (no / / )"
          />
        </div>
        <div className="w-24">
          <label htmlFor="why-regex-flags" className="text-xs text-slate-500 dark:text-slate-400">
            Flags
          </label>
          <input
            id="why-regex-flags"
            value={flags}
            onChange={(event) => setFlags(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white/90 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
        <div
          className="whitespace-pre-wrap rounded-md border border-slate-300 bg-slate-900 p-3 font-mono text-sm text-white dark:border-slate-700"
          dangerouslySetInnerHTML={{ __html: highlighted.html }}
        />
        {highlighted.error && <div className="mt-2 text-xs text-red-400">Invalid pattern — check the syntax.</div>}
      </div>
    </div>
  );
}

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

  useEffect(() => {
    let mounted = true;
    let index = 0;

    setStage("curl");
    setTyped("");

    const typing = setInterval(() => {
      if (!mounted) {
        return;
      }

      index += 1;
      setTyped(curlExample.slice(0, index));

      if (index >= curlExample.length) {
        clearInterval(typing);
        setTimeout(() => {
          setStage("arrow");
          setTyped("→ converting …");
          setTimeout(() => {
            setStage("fetch");
            let fetchIndex = 0;
            setTyped("");
            const fetchTyping = setInterval(() => {
              fetchIndex += 1;
              setTyped(fetchExample.slice(0, fetchIndex));
              if (fetchIndex >= fetchExample.length) {
                clearInterval(fetchTyping);
              }
            }, 12);
          }, 700);
        }, 700);
      }
    }, 10);

    return () => {
      mounted = false;
      clearInterval(typing);
    };
  }, [curlExample, fetchExample]);

  return (
    <div className="space-y-3 font-mono text-sm text-slate-900 dark:text-slate-100">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 dark:bg-slate-800/70">
          <Repeat className="h-4 w-4 text-sky-600" />
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">Live conversion</div>
      </div>
      <div className={stage === "curl" ? "text-indigo-400" : ""}>
        <pre className="min-h-[120px] overflow-auto rounded-md border border-slate-700 bg-slate-950 p-4 font-mono text-[13px] text-slate-100">
          <code>{typed}</code>
        </pre>
      </div>
    </div>
  );
}

function pretty(jsonLike: string) {
  try {
    return JSON.stringify(JSON.parse(jsonLike), null, 2);
  } catch {
    return jsonLike;
  }
}
