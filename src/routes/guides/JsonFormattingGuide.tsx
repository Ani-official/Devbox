import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "What does formatting JSON actually do?",
    a: "Formatting (also called pretty-printing or beautifying) re-indents JSON so nested objects and arrays sit on their own lines. It does not change the data — it only changes the whitespace so the structure is readable.",
  },
  {
    q: "Is it safe to paste sensitive JSON into an online formatter?",
    a: "It depends on the tool. DevBox's JSON Formatter runs entirely in your browser and never uploads your input to a server, so it is safe for local debugging. As a general rule, avoid pasting production secrets or personal data into any online tool unless it clearly processes data client-side.",
  },
  {
    q: "Why does my JSON say 'Unexpected token' when it looks fine?",
    a: "The most common causes are trailing commas, single quotes instead of double quotes, unquoted keys, or a comment (// or /* */). JSON allows none of these. A formatter/validator points you to the exact position of the first error.",
  },
  {
    q: "What is the difference between JSON and a JavaScript object?",
    a: "JSON is a text format with strict rules: keys must be double-quoted strings, and only strings, numbers, booleans, null, arrays, and objects are allowed. A JavaScript object literal is code and can contain functions, comments, trailing commas, and unquoted keys — none of which are valid JSON.",
  },
  {
    q: "Should I commit minified or formatted JSON to source control?",
    a: "Commit formatted JSON for anything a human edits (config files, fixtures, translations) so diffs are readable. Use minified JSON for data that is only sent over the wire or served to clients, where size matters.",
  },
];

export default function JsonFormattingGuide() {
  return (
    <GuideLayout
      title="JSON Formatting: A Practical Guide"
      description="Learn how to format, validate, and debug JSON — from fixing 'unexpected token' errors to choosing between minified and pretty-printed output, with copy-paste examples."
      canonicalPath="/guides/json-formatting"
      readingTime="6 min read"
      faqs={faqs}
      relatedTools={[
        { label: "JSON Formatter & Validator", to: "/workspace/json-formatter" },
        { label: "JSON ⇄ YAML Converter", to: "/workspace/json-yaml-converter" },
      ]}
      relatedGuides={[
        { label: "JSON vs YAML: when to use each", to: "/guides/json-yaml" },
        { label: "Decoding and inspecting JWTs", to: "/guides/jwt-decoding" },
      ]}
    >
      <p>
        JSON (JavaScript Object Notation) is the default language of APIs, config files, and data exchange
        on the web. It is easy to produce but surprisingly easy to break: one stray comma or a single quote
        in the wrong place turns a valid payload into a parser error. Formatting JSON — re-indenting it into
        a clean, readable shape — is the fastest way to spot those mistakes and understand the structure of
        data you did not write yourself.
      </p>
      <p>
        This guide covers what formatting does, the errors it helps you catch, a reliable debugging workflow,
        and when to prefer minified over pretty-printed output.
      </p>

      <h2>What "formatting" means</h2>
      <p>Formatting only changes whitespace. Take this minified response from an API:</p>
      <pre>
        <code>{`{"id":42,"name":"Ada","roles":["admin","editor"],"active":true}`}</code>
      </pre>
      <p>Formatted with two-space indentation, the same data becomes:</p>
      <pre>
        <code>{`{
  "id": 42,
  "name": "Ada",
  "roles": ["admin", "editor"],
  "active": true
}`}</code>
      </pre>
      <p>
        The bytes that matter — keys, values, structure — are identical. Only the line breaks and indentation
        changed. That is why formatting is safe: it never alters your data, so you can pretty-print a payload,
        inspect it, and copy it back with confidence.
      </p>

      <h2>When you actually need it</h2>
      <ul>
        <li>
          <strong>Reading an API response.</strong> Logs and network tabs often show minified JSON on a single
          line. Formatting makes nesting visible so you can find the field you care about.
        </li>
        <li>
          <strong>Debugging a rejected request.</strong> When a server returns <code>400 Bad Request</code>,
          the body you sent is usually the culprit. Formatting reveals the structural mistake immediately.
        </li>
        <li>
          <strong>Reviewing config or fixtures.</strong> Pretty-printed JSON produces clean line-by-line diffs
          in pull requests; minified JSON produces one unreadable diff line.
        </li>
        <li>
          <strong>Sharing data with a teammate.</strong> A formatted snippet (or a shareable link) is far
          easier to reason about together than a wall of text.
        </li>
      </ul>

      <h2>The errors formatting helps you catch</h2>
      <p>
        A good formatter also validates. When the input is invalid it stops and points to the first problem.
        These are the mistakes it surfaces most often:
      </p>
      <h3>Trailing commas</h3>
      <p>Valid in JavaScript, illegal in JSON. The comma after <code>"editor"</code> below breaks parsing:</p>
      <pre>
        <code>{`{
  "roles": ["admin", "editor",]
}`}</code>
      </pre>
      <h3>Single quotes and unquoted keys</h3>
      <p>JSON requires double quotes around both keys and string values. This is invalid:</p>
      <pre>
        <code>{`{ name: 'Ada' }`}</code>
      </pre>
      <p>The correct form is:</p>
      <pre>
        <code>{`{ "name": "Ada" }`}</code>
      </pre>
      <h3>Comments</h3>
      <p>
        JSON has no comment syntax. Lines starting with <code>//</code> or wrapped in <code>{"/* */"}</code>{" "}
        will fail. If you need comments, use a superset like JSON5 or YAML instead, then convert.
      </p>
      <h3>Numbers stored as strings</h3>
      <p>
        <code>"42"</code> is a string; <code>42</code> is a number. This is valid JSON but a frequent source
        of bugs when your application expects an integer and receives a quoted value. Formatting makes the
        quotes obvious so you can catch the type mismatch.
      </p>

      <h2>A reliable debugging workflow</h2>
      <ol>
        <li>Paste the raw JSON into a formatter/validator.</li>
        <li>
          If it reports an error, jump to the line and column it names. The problem is almost always at or
          just before that position — a missing quote, an extra comma, or an unclosed bracket.
        </li>
        <li>Fix one error and re-run. Errors often cascade, so resolve them top to bottom.</li>
        <li>Once it parses, read the formatted output to confirm the structure matches what you expect.</li>
        <li>Copy the clean output back into your code, ticket, or config file.</li>
      </ol>

      <h2>Minified vs. formatted: which to ship</h2>
      <p>Both are valid — they differ only in whitespace — so choose based on the audience:</p>
      <table>
        <thead>
          <tr>
            <th>Use minified when…</th>
            <th>Use formatted when…</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Sending data over the network (smaller payloads)</td>
            <td>A human edits or reviews the file</td>
          </tr>
          <tr>
            <td>Serving API responses at scale</td>
            <td>Storing config, fixtures, or translations in git</td>
          </tr>
          <tr>
            <td>Embedding JSON in a data attribute or URL</td>
            <td>Documenting an example in a README or ticket</td>
          </tr>
        </tbody>
      </table>
      <p>
        Build tools handle this automatically: you keep formatted JSON in source control, and your bundler or
        server minifies it in production. You rarely need to minify by hand.
      </p>

      <h2>Best practices</h2>
      <ul>
        <li>
          <strong>Validate before you trust.</strong> Never assume a payload is well-formed — parse it first.
        </li>
        <li>
          <strong>Keep indentation consistent.</strong> Two spaces is the most common convention; pick one and
          let your tooling enforce it.
        </li>
        <li>
          <strong>Prefer client-side tools for sensitive data.</strong> If a payload contains anything private,
          use a formatter that processes data in the browser rather than uploading it.
        </li>
        <li>
          <strong>Watch your types.</strong> Numbers, booleans, and <code>null</code> should not be quoted
          unless they are genuinely strings.
        </li>
      </ul>

      <h2>Try it</h2>
      <p>
        The <Link to="/workspace/json-formatter">DevBox JSON Formatter</Link> formats and validates entirely in
        your browser, highlights the first syntax error, and gives you a shareable link so a teammate can open
        the exact same structure. If you also work with config files, the{" "}
        <Link to="/workspace/json-yaml-converter">JSON ⇄ YAML Converter</Link> turns a validated payload into
        clean YAML and back.
      </p>
    </GuideLayout>
  );
}
