import { Link } from "react-router-dom";
import PageMeta from "../components/PageMeta";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-700 dark:text-gray-300 leading-relaxed">
      <PageMeta
        title="About DevBox | Browser-Based Developer Tools"
        description="Learn what DevBox is, how the tools work, and why the site exists as a privacy-first developer utility hub."
        canonicalPath="/about"
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About DevBox",
          url: "https://devbox-gamma.vercel.app/about",
        }}
      />

      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">About DevBox</h1>
      <p className="mb-4">
        DevBox is a browser-based developer toolbox built for everyday tasks that should be quick, private, and easy to understand.
        We focus on utilities that solve real problems: formatting JSON, inspecting JWTs, testing regex patterns, converting cURL requests,
        and cleaning up SVGs before shipping them into production.
      </p>
      <p className="mb-4">
        The site is intentionally narrow in scope. That focus lets us document each tool properly, add practical examples,
        and keep every page fast, clean, and genuinely useful.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-white mb-3">What Makes DevBox Different</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Tools run directly in the browser so users can work without creating an account.</li>
        <li>Each utility includes practical examples, not just an input box and output pane.</li>
        <li>Supporting pages explain the use case, edge cases, and best practices.</li>
        <li>The site is structured to be easy to navigate on mobile and desktop.</li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-white mb-3">Our Tools</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>
          <Link to="/workspace/json-formatter" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            JSON Formatter & Validator
          </Link>{" "}
          - Format, beautify, validate, and share JSON data.
        </li>
        <li>
          <Link to="/workspace/jwt-decoder" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            JWT Decoder
          </Link>{" "}
          - Inspect token headers, payloads, and signatures.
        </li>
        <li>
          <Link to="/workspace/regex-tester" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Regex Tester
          </Link>{" "}
          - Debug patterns with live highlighting and sharing.
        </li>
        <li>
          <Link to="/workspace/curl-converter" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            cURL Converter
          </Link>{" "}
          - Convert request examples into fetch or Axios code.
        </li>
        <li>
          <Link to="/workspace/base64-tool" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Base64 Encoder / Decoder
          </Link>{" "}
          - Encode or decode Base64 strings quickly.
        </li>
        <li>
          <Link to="/workspace/color-converter" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            Color Converter
          </Link>{" "}
          - Convert between HEX, RGB, and HSL.
        </li>
        <li>
          <Link to="/workspace/svg-optimizer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            SVG Optimizer
          </Link>{" "}
          - Reduce file size while preserving visual fidelity.
        </li>
        <li>
          <Link to="/workspace/json-yaml-converter" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
            JSON ⇄ YAML Converter
          </Link>{" "}
          - Convert config formats with examples and guidance.
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-white mb-3">How We Approach Content</h2>
      <p className="mb-4">
        Each page answers a real question. That means a clear purpose, worked examples you can copy, and enough
        explanation to actually finish the task — not just an empty input box.
      </p>
      <p className="mb-4">
        We also keep the site privacy-first: inputs stay local in the browser wherever possible, and the public policy pages
        explain how third-party services such as AdSense are used.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-white mb-3">Contact</h2>
      <p>
        Questions, corrections, or feature suggestions are welcome at{" "}
        <Link to="/contact" className="text-blue-600 dark:text-blue-400 underline">
          the contact page
        </Link>
        .
      </p>
    </div>
  );
}
