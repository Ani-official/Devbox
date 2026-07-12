import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";
import {
  ArrowRight,
  Binary,
  Braces,
  Code2,
  Image,
  Link2,
  Palette,
  Regex,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ToolBentoGrid from "../components/ToolBentoGrid";
import PageMeta from "../components/PageMeta";

const WhyDevBox = lazy(() => import("../components/WhyDevbox"));

type Tool = {
  title: string;
  desc: string;
  link: string;
  icon: LucideIcon;
  size: "small" | "medium" | "large" | "wide";
  color: string;
};

const featuredGuides = [
  {
    title: "JSON Formatting Guide",
    desc: "Learn how to format, validate, and share JSON without breaking structure or losing readability.",
    link: "/guides/json-formatting",
    icon: Braces,
  },
  {
    title: "Regex Testing Guide",
    desc: "Understand flags, match groups, and debugging patterns with practical examples.",
    link: "/guides/regex-testing",
    icon: Regex,
  },
  {
    title: "cURL to Fetch Guide",
    desc: "See how to convert request examples into code you can paste into your app immediately.",
    link: "/guides/curl-to-fetch",
    icon: Terminal,
  },
];

const quickStats = [
  { value: "8", label: "Core tools" },
  { value: "8", label: "In-depth guides" },
  { value: "100%", label: "Browser-based" },
];

export default function Home() {
  const tools: Tool[] = [
    {
      title: "JSON Formatter",
      desc: "Format, validate, and beautify JSON instantly with color-coded syntax.",
      link: "/workspace/json-formatter",
      icon: Braces,
      size: "large",
      color: "from-blue-500/10 to-blue-200/10",
    },
    {
      title: "JWT Decoder",
      desc: "Decode and inspect JSON Web Tokens (JWT) with ease.",
      link: "/workspace/jwt-decoder",
      icon: Terminal,
      size: "small",
      color: "from-red-500/10 to-red-200/10",
    },
    {
      title: "Regex Tester",
      desc: "Visualize and debug regex patterns in real-time.",
      link: "/workspace/regex-tester",
      icon: Regex,
      size: "medium",
      color: "from-purple-500/10 to-purple-200/10",
    },
    {
      title: "cURL Converter",
      desc: "Turn cURL commands into clean Fetch or Axios snippets.",
      link: "/workspace/curl-converter",
      icon: Terminal,
      size: "medium",
      color: "from-green-500/10 to-green-200/10",
    },
    {
      title: "Base64 Tool",
      desc: "Encode and decode Base64 easily - secure and fast.",
      link: "/workspace/base64-tool",
      icon: Binary,
      size: "small",
      color: "from-orange-500/10 to-orange-200/10",
    },
    {
      title: "Color Converter",
      desc: "Switch between HEX, RGB, HSL formats instantly.",
      link: "/workspace/color-converter",
      icon: Palette,
      size: "small",
      color: "from-pink-500/10 to-pink-200/10",
    },
    {
      title: "JSON ⇄ YAML Converter",
      desc: "Convert structured JSON data into clean, readable YAML format instantly.",
      link: "/workspace/json-yaml-converter",
      icon: Braces,
      size: "wide",
      color: "from-lime-500/10 to-lime-200/10",
    },
    {
      title: "SVG Optimizer",
      desc: "Minify and clean SVG code while keeping vector quality intact.",
      link: "/workspace/svg-optimizer",
      icon: Image,
      size: "medium",
      color: "from-cyan-500/10 to-cyan-200/10",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-12 md:py-16">
      <PageMeta
        title="DevBox - Online Developer Tools and Guides"
        description="DevBox is a free developer toolbox with utilities, step-by-step guides, and browser-based workflows for JSON, regex, cURL, SVG, Base64, and more."
        canonicalPath="/"
        image="https://devbox-gamma.vercel.app/preview.png"
        schema={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "DevBox",
          url: "https://devbox-gamma.vercel.app/",
          description:
            "A free online developer toolbox with browser-based utilities and practical developer guides.",
          publisher: {
            "@type": "Organization",
            name: "DevBox",
          },
        }}
      />

      <section className="relative w-full max-w-6xl">
        <div className="absolute inset-x-[-8vw] top-[-10vh] -z-10 h-[72vh] bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_24%)] blur-3xl" />
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800 dark:border-blue-900/70 dark:bg-blue-950/50 dark:text-blue-200">
              <Sparkles className="h-4 w-4" />
              Privacy-first tools, guides, and workflows
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight text-slate-950 dark:text-white md:text-6xl">
              A cleaner way to ship{" "}
              <span className="bg-gradient-to-r from-blue-700 via-cyan-600 to-emerald-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-300 dark:to-emerald-300">
                everyday developer tools
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Format JSON, inspect JWTs, test regex, and convert API examples in seconds — right in your browser.
              Everything you paste stays on your device: nothing is uploaded or stored on a server.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/workspace/json-formatter"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
              >
                Open Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/guides"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Read Guides
                <Code2 className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-900/80"
                >
                  <div className="text-2xl font-black text-slate-950 dark:text-white">{stat.value}</div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-slate-100 shadow-2xl dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Live product preview</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">DevBox in action</h2>
                </div>
                <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                  Browser-native
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {[
                  "Format JSON and validate structure instantly",
                  "Decode JWTs and inspect claims safely",
                  "Convert cURL examples into fetch code",
                  "Optimize SVGs without losing fidelity",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200"
                  >
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 w-full max-w-6xl border-t border-slate-200/80 pt-14 dark:border-slate-800">
        <div className="mb-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Core tools</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
            Everyday developer tools, ready when you are
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Fast, no-signup utilities for the tasks developers repeat every day. Pick a tool and start working instantly.
          </p>
        </div>
        <ToolBentoGrid tools={tools} />
      </section>

      <section className="mt-14 w-full max-w-6xl border-t border-slate-200/80 pt-14 dark:border-slate-800">
        <div className="mb-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Why DevBox</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
            Fast, private, and built for real developer work
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Three things you can count on every time you open a tool.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Everything runs in your browser",
              text: "Your input never leaves your device — no uploads, no accounts, no waiting on a server.",
              icon: ShieldCheck,
            },
            {
              title: "Built around real tasks",
              text: "Each tool solves one common job — format, decode, test, convert — so you get in and out fast.",
              icon: Link2,
            },
            {
              title: "Guides when you need them",
              text: "Step-by-step tutorials and examples walk you through each tool and its common edge cases.",
              icon: Sparkles,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
              >
                <Icon className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                <h2 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">{item.title}</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-14 w-full max-w-6xl border-t border-slate-200/80 pt-14 dark:border-slate-800">
        <div className="mb-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Guides &amp; tutorials</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
            Learn the workflow behind each tool
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Step-by-step walkthroughs for formatting JSON, testing regex, and converting cURL requests — with copy-paste examples.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredGuides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link
                key={guide.title}
                to={guide.link}
                className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm transition-transform hover:-translate-y-1 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
              >
                <Icon className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                <h3 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">{guide.title}</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-300">{guide.desc}</p>
              </Link>
            );
          })}
        </div>
        <div className="mt-6">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400"
          >
            Browse all 8 guides
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="mt-14 w-full max-w-6xl border-t border-slate-200/80 pt-14 dark:border-slate-800">
        <Suspense fallback={<div className="h-96 rounded-3xl border border-slate-200 bg-white/60 dark:border-slate-800 dark:bg-slate-900/60" />}>
          <WhyDevBox />
        </Suspense>
      </div>

      <section className="mt-14 w-full max-w-6xl border-t border-slate-200/80 pt-14 dark:border-slate-800">
        <div className="mb-6 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">FAQ</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Quick answers on what the tools do, how your data is handled, and where to begin.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/75">
          {[
            {
              q: "Is DevBox free?",
              a: "Yes. The core tools are free to use and run directly in the browser.",
            },
            {
              q: "Does DevBox store my input?",
              a: "No. Everything you paste is processed locally in your browser and never uploaded to a server.",
            },
            {
              q: "Do the guides cost anything?",
              a: "No. The guides are free and walk you through each tool with practical, copy-paste examples.",
            },
            {
              q: "What should I use first?",
              a: "Start with JSON Formatter, Regex Tester, or cURL Converter if you want the highest-value utility pages.",
            },
          ].map((item, index) => (
            <details
              key={item.q}
              className={`group px-5 py-5 transition-colors open:bg-slate-50 dark:open:bg-slate-800/40 ${index === 0 ? "" : "border-t border-slate-200/80 dark:border-slate-800"}`}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                <span className="text-lg font-semibold text-slate-950 dark:text-white">{item.q}</span>
                <span className="text-slate-400 transition-transform group-open:rotate-45 dark:text-slate-500">+</span>
              </summary>
              <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

