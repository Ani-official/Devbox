import { Helmet } from "react-helmet-async";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-700 dark:text-gray-300 leading-relaxed">
      <Helmet>
        <title>About DevBox | Free Online Developer Tools</title>
        <meta
          name="description"
          content="Learn about DevBox — a free, no-login online developer toolbox with JSON Formatter, JWT Decoder, Regex Tester, Base64, Color Converter, SVG Optimizer, cURL Converter, and more."
        />
        <meta property="og:title" content="About DevBox | Free Online Developer Tools" />
        <meta
          property="og:description"
          content="DevBox provides free, browser-based web tools for developers: JSON formatting, JWT decoding, regex testing, color conversion, SVG optimization, and more."
        />
        <link rel="canonical" href="https://devbox-gamma.vercel.app/about" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">About DevBox</h1>
      <p className="mb-4">
        DevBox is a free, all-in-one online developer toolbox designed to help you work faster and smarter.
        Whether you're formatting a messy JSON blob, decoding a JWT for debugging, testing a regular expression,
        or converting colors between HEX and HSL — DevBox brings together the everyday utilities that developers
        reach for multiple times a day, all in one place.
      </p>
      <p className="mb-4">
        Every tool runs entirely in your browser. No account required, no data uploaded to any server, and no
        subscription fees. DevBox is built for developers who value speed, privacy, and simplicity.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-white mb-3">Our Tools</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>
          <a href="/workspace/json-formatter" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">JSON Formatter & Validator</a>
          {" "}— Format, beautify, and validate JSON data instantly with syntax highlighting. Generate shareable links to your formatted JSON.
        </li>
        <li>
          <a href="/workspace/jwt-decoder" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">JWT Decoder</a>
          {" "}— Decode and inspect JSON Web Tokens. View the header, payload claims, and signature at a glance — useful for debugging authentication issues.
        </li>
        <li>
          <a href="/workspace/regex-tester" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Regex Tester</a>
          {" "}— Test and debug regular expressions with live match highlighting. Supports all standard flags: global, case-insensitive, multiline, and more.
        </li>
        <li>
          <a href="/workspace/curl-converter" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">cURL Converter</a>
          {" "}— Convert cURL commands to ready-to-use JavaScript Fetch or Axios code snippets in one click.
        </li>
        <li>
          <a href="/workspace/base64-tool" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Base64 Encoder / Decoder</a>
          {" "}— Encode text or data to Base64 and decode Base64 strings back to UTF-8. Useful for authentication headers, data URIs, and JWT inspection.
        </li>
        <li>
          <a href="/workspace/color-converter" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Color Converter</a>
          {" "}— Convert colors between HEX, RGB, and HSL formats instantly with a visual color picker and one-click copy for each format.
        </li>
        <li>
          <a href="/workspace/svg-optimizer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">SVG Optimizer</a>
          {" "}— Minify and clean SVG markup by removing editor metadata, comments, and redundant attributes — without losing visual quality.
        </li>
        <li>
          <a href="/workspace/json-yaml-converter" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">JSON ⇄ YAML Converter</a>
          {" "}— Convert between JSON and YAML formats. Useful when working with APIs, Kubernetes configs, Docker Compose files, and CI/CD pipelines.
        </li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-white mb-3">Our Mission</h2>
      <p className="mb-4">
        Our mission is to make everyday developer tasks easier by providing accessible, no-login, browser-based
        tools that work reliably across devices. We believe developer utilities should be fast, distraction-free,
        and available without unnecessary friction.
      </p>
      <p className="mb-4">
        DevBox is continuously evolving. We regularly add new tools and improve existing ones based on the needs
        of the developer community. If you have a suggestion for a tool you'd like to see, we'd love to hear from you.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-white mb-3">Privacy & Security</h2>
      <p className="mb-4">
        All processing in DevBox happens locally in your browser. Your data — whether it's a JWT token, JSON payload,
        SVG file, or Base64 string — is never sent to our servers. We do not collect, store, or log any input data.
        For more details, see our <a href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>.
      </p>

      <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-white mb-3">Contact</h2>
      <p>
        If you have any suggestions, bug reports, or questions, reach out to us at{" "}
        <a href="mailto:service.devbox@gmail.com" className="text-blue-600 dark:text-blue-400 underline">
          service.devbox@gmail.com
        </a>.
        We read every message and appreciate your feedback.
      </p>
    </div>
  );
}
