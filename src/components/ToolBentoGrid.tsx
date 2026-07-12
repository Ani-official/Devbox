import { useState } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface Tool {
  title: string;
  desc: string;
  link: string;
  icon: LucideIcon;
  size: "small" | "medium" | "large" | "wide";
  color: string;
}

const JSON_PREVIEW = `{
  "name": "DevBox",
  "type": "Utility Tool",
  "features": [
    "JSON Formatter",
    "Regex Tester",
    "cURL Converter"
  ],
  "license": "MIT"
}`;

const JSON_BADGES = ["Format", "Validate", "Beautify", "Copy"];

export default function ToolBentoGrid({ tools }: { tools: Tool[] }) {
  const [jsonInput] = useState(JSON_PREVIEW);

  return (
    <section
      className="grid w-full grid-cols-1 gap-6 max-w-6xl auto-rows-[200px] sm:grid-cols-2 lg:grid-cols-4 md:auto-rows-[240px]"
      aria-label="Developer tools showcase"
    >
      {tools.map((tool) => {
        const Icon = tool.icon;
        const spanClass =
          tool.size === "large"
            ? "md:col-span-2 md:row-span-2"
            : tool.size === "wide"
              ? "md:col-span-2"
              : "md:col-span-1";

        const isJsonFormatter = tool.title.toLowerCase().includes("json formatter");

        return (
          <article
            key={tool.title}
            className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${tool.color} border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900/70 ${spanClass}`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-black/5 opacity-60 dark:from-white/5 dark:to-black/20" />
            <div className={`relative z-10 flex h-full flex-col p-6 ${isJsonFormatter ? "gap-4" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/70 p-3 text-blue-700 backdrop-blur-sm dark:bg-gray-800/60 dark:text-blue-400">
                  <Icon size={26} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{tool.title}</h3>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{tool.desc}</p>

              {isJsonFormatter && (
                <div className="mt-1 flex flex-1 flex-col rounded-2xl border border-slate-300/70 bg-slate-950 px-4 py-4 text-xs text-slate-100 shadow-inner dark:border-slate-700/70">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-slate-400">
                    <span>Structured preview</span>
                    <span>Live-ready</span>
                  </div>
                  <div className="mt-3 grid flex-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                    <pre className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 whitespace-pre-wrap leading-5">
                      <code>{jsonInput}</code>
                    </pre>
                    <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                      <div>
                        <p className="text-sm font-semibold text-white">What users get</p>
                        <p className="mt-2 text-xs leading-5 text-slate-300">
                          A focused formatter with validation, formatting, and copy-friendly output for everyday API work.
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {JSON_BADGES.map((badge) => (
                          <span
                            key={badge}
                            className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-medium text-cyan-200"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Link to={tool.link} className="mt-auto text-sm font-medium text-blue-700 hover:underline dark:text-blue-400">
                Open Tool →
              </Link>
            </div>
          </article>
        );
      })}
    </section>
  );
}

