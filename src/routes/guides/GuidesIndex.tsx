import { Link } from "react-router-dom";
import { Braces, Regex, Terminal, KeyRound, Binary, Palette, FileCode2, Image } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PageMeta from "../../components/PageMeta";

type GuideCard = {
  title: string;
  desc: string;
  to: string;
  icon: LucideIcon;
  time: string;
};

const guides: GuideCard[] = [
  {
    title: "JSON Formatting: A Practical Guide",
    desc: "Format and validate JSON, fix 'unexpected token' errors, and choose between minified and pretty-printed output.",
    to: "/guides/json-formatting",
    icon: Braces,
    time: "6 min read",
  },
  {
    title: "Regex Testing: Flags, Groups, and Debugging",
    desc: "How flags change matching, how capture groups extract data, and how to fix patterns that match too much.",
    to: "/guides/regex-testing",
    icon: Regex,
    time: "7 min read",
  },
  {
    title: "Converting cURL to fetch and axios",
    desc: "Turn cURL examples from API docs into working JavaScript — and know what needs manual review before shipping.",
    to: "/guides/curl-to-fetch",
    icon: Terminal,
    time: "6 min read",
  },
  {
    title: "Decoding and Understanding JWTs",
    desc: "What a JSON Web Token contains, the difference between decoding and verifying, and the security rules that matter.",
    to: "/guides/jwt-decoding",
    icon: KeyRound,
    time: "7 min read",
  },
  {
    title: "Base64 Encoding, Explained",
    desc: "Why Base64 exists, how it differs from encryption and Base64URL, and when to use data URIs.",
    to: "/guides/base64-encoding",
    icon: Binary,
    time: "6 min read",
  },
  {
    title: "HEX, RGB, and HSL Color Formats",
    desc: "How the three web color formats relate, when to use each, and why HSL makes building palettes easier.",
    to: "/guides/color-formats",
    icon: Palette,
    time: "5 min read",
  },
  {
    title: "JSON vs YAML: When to Use Each",
    desc: "Syntax differences, the type-inference gotchas that bite people, and a safe way to convert between them.",
    to: "/guides/json-yaml",
    icon: FileCode2,
    time: "6 min read",
  },
  {
    title: "Optimizing SVGs for the Web",
    desc: "Why exported SVGs are bloated, what optimization safely removes, and when to inline vs. link them.",
    to: "/guides/svg-optimization",
    icon: Image,
    time: "6 min read",
  },
];

export default function GuidesIndex() {
  return (
    <div className="mx-auto max-w-5xl px-1 py-8">
      <PageMeta
        title="Developer Guides & Tutorials | DevBox"
        description="Practical, example-driven guides on JSON, regex, cURL, JWTs, Base64, color formats, YAML, and SVG optimization — written to help you finish a specific task."
        canonicalPath="/guides"
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "DevBox Developer Guides",
          url: "https://devbox-gamma.vercel.app/guides",
          description:
            "Practical developer guides on JSON, regex, cURL, JWTs, Base64, colors, YAML, and SVG.",
        }}
      />

      <header className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
          Guides &amp; tutorials
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 dark:text-white">
          Developer guides
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Short, practical walkthroughs with copy-paste examples. Each guide pairs with a browser-based tool so
          you can try the workflow immediately.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {guides.map((g) => {
          const Icon = g.icon;
          return (
            <Link
              key={g.to}
              to={g.to}
              className="group flex flex-col rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition-transform hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/70"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {g.time}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-950 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
                {g.title}
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{g.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
