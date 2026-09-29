import { Link } from "react-router-dom";
import {
  Braces,
  Regex,
  Terminal,
  KeyRound,
  Binary,
  Palette,
  FileCode2,
  Image,
  Binary as BitIcon,
  ScanSearch,
  GitBranch,
  ShieldAlert,
  SwatchBook,
  Network,
  Layers,
  FileWarning,
  Type,
  Link2,
} from "lucide-react";
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
  {
    title: "The Bit-Level Mechanics of Base64 Encoding",
    desc: "How 3 bytes become 4 characters, worked bit-by-bit, plus padding, alphabets, and why it isn't encryption.",
    to: "/guides/base64-bit-mechanics",
    icon: BitIcon,
    time: "8 min read",
  },
  {
    title: "How JSON Parsers Work",
    desc: "Tokenizing, recursive-descent parsing, and exactly why trailing commas and single quotes fail.",
    to: "/guides/json-parsing-internals",
    icon: ScanSearch,
    time: "9 min read",
  },
  {
    title: "Regex Engines Explained",
    desc: "Backtracking NFAs, catastrophic backtracking, ReDoS, and why linear-time engines can't do backreferences.",
    to: "/guides/regex-engine-internals",
    icon: GitBranch,
    time: "9 min read",
  },
  {
    title: "JWT Security Deep Dive",
    desc: "The alg:none bypass, RS256/HS256 algorithm confusion, and the claims a valid signature doesn't check.",
    to: "/guides/jwt-security",
    icon: ShieldAlert,
    time: "9 min read",
  },
  {
    title: "Color Theory for Developers",
    desc: "Gamma correction, why averaging hex colors gives the wrong gray, and why HSL isn't perceptually uniform.",
    to: "/guides/color-theory",
    icon: SwatchBook,
    time: "9 min read",
  },
  {
    title: "The Anatomy of an HTTP Request",
    desc: "The raw wire format, what cURL flags actually send, and why CORS preflight only happens in browsers.",
    to: "/guides/http-request-anatomy",
    icon: Network,
    time: "10 min read",
  },
  {
    title: "How SVG Rendering Works",
    desc: "The path-data mini-language, why exported SVGs bloat, and what an optimizer's passes actually remove.",
    to: "/guides/svg-rendering-internals",
    icon: Layers,
    time: "9 min read",
  },
  {
    title: "YAML's Hidden Traps",
    desc: "The Norway problem, octal permission ambiguity, and why quoting is the only real fix.",
    to: "/guides/yaml-design-tradeoffs",
    icon: FileWarning,
    time: "9 min read",
  },
  {
    title: "Character Encoding Explained",
    desc: "ASCII, code pages, the codepoint-vs-encoding distinction, and how UTF-8 actually packs bits.",
    to: "/guides/character-encoding",
    icon: Type,
    time: "9 min read",
  },
  {
    title: "URL Encoding and Percent-Encoding",
    desc: "What RFC 3986 actually escapes, why + means space in query strings, and how double-encoding happens.",
    to: "/guides/url-encoding",
    icon: Link2,
    time: "8 min read",
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
