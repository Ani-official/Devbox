import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "Is YAML a superset of JSON?",
    a: "Effectively yes. Any valid JSON is also valid YAML, so a YAML parser can read JSON directly. YAML adds indentation-based syntax, comments, and other conveniences on top.",
  },
  {
    q: "When should I use YAML instead of JSON?",
    a: "Use YAML for configuration that humans write and read — CI pipelines, Docker Compose, Kubernetes manifests — where comments and readability matter. Use JSON for data exchanged between programs, such as API requests and responses.",
  },
  {
    q: "Why is indentation so important in YAML?",
    a: "YAML uses indentation to express structure instead of braces and brackets. Inconsistent spaces, or tabs mixed with spaces, change the meaning or cause parse errors. Always use spaces, never tabs.",
  },
  {
    q: "Does converting JSON to YAML lose any data?",
    a: "No. Both represent the same data model of maps, lists, and scalars, so a round trip preserves your values. Only formatting (comments, key order in some cases, and quoting style) may differ.",
  },
  {
    q: "Why did my YAML value become true or a number unexpectedly?",
    a: "YAML infers types, so bare words like yes, no, on, off, and version numbers can be read as booleans or numbers. Quote the value (\"3.10\") when you need it to stay a string — a classic 'Norway problem' (NO becoming false).",
  },
];

export default function JsonYamlGuide() {
  return (
    <GuideLayout
      title="JSON vs YAML: When to Use Each"
      description="How JSON and YAML relate, their syntax differences, the type-inference gotchas that bite people, and a safe way to convert between them."
      canonicalPath="/guides/json-yaml"
      readingTime="6 min read"
      faqs={faqs}
      relatedTools={[
        { label: "JSON ⇄ YAML Converter", to: "/workspace/json-yaml-converter" },
        { label: "JSON Formatter", to: "/workspace/json-formatter" },
      ]}
      relatedGuides={[
        { label: "JSON formatting basics", to: "/guides/json-formatting" },
        { label: "cURL to fetch and axios", to: "/guides/curl-to-fetch" },
      ]}
    >
      <p>
        JSON and YAML describe the same kind of data — maps, lists, and scalar values — but they are tuned for
        different audiences. JSON is precise and universal, ideal for machines. YAML is airy and comment-friendly,
        ideal for humans writing configuration. Knowing which to reach for (and how to convert cleanly) saves a
        lot of friction.
      </p>

      <h2>The same data, two syntaxes</h2>
      <p>Here is a small config in JSON:</p>
      <pre>
        <code>{`{
  "service": "api",
  "replicas": 3,
  "ports": [8080, 8443],
  "env": { "LOG_LEVEL": "info" }
}`}</code>
      </pre>
      <p>And the identical data in YAML:</p>
      <pre>
        <code>{`service: api
replicas: 3
ports:
  - 8080
  - 8443
env:
  LOG_LEVEL: info`}</code>
      </pre>
      <p>
        YAML drops the braces, brackets, and most quotes, using indentation to express nesting and dashes for
        list items. Because any valid JSON is also valid YAML, a YAML parser can read the JSON version directly.
      </p>

      <h2>Key differences</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>JSON</th>
            <th>YAML</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Structure</td><td>Braces and brackets</td><td>Indentation</td></tr>
          <tr><td>Comments</td><td>Not allowed</td><td><code>#</code> comments</td></tr>
          <tr><td>Quotes</td><td>Required on keys and strings</td><td>Usually optional</td></tr>
          <tr><td>Best for</td><td>APIs, data exchange</td><td>Config, pipelines, manifests</td></tr>
          <tr><td>Readability</td><td>Dense</td><td>Airy, human-friendly</td></tr>
        </tbody>
      </table>

      <h2>Choosing the right one</h2>
      <ul>
        <li>
          <strong>Reach for JSON</strong> when programs are the reader and writer: REST request and response
          bodies, browser <code>localStorage</code>, message queues, and anywhere strictness prevents bugs.
        </li>
        <li>
          <strong>Reach for YAML</strong> when people maintain the file by hand: GitHub Actions and other CI
          pipelines, Docker Compose, Kubernetes manifests, and Ansible playbooks — places where comments and
          readability pay off.
        </li>
      </ul>

      <h2>YAML's type-inference gotchas</h2>
      <p>
        YAML's convenience has a sharp edge: it guesses types from bare values, which occasionally surprises
        you.
      </p>
      <ul>
        <li>
          <strong>Booleans in disguise.</strong> <code>yes</code>, <code>no</code>, <code>on</code>, and{" "}
          <code>off</code> can be read as booleans. The famous "Norway problem" is a country-code list where{" "}
          <code>NO</code> silently becomes <code>false</code>.
        </li>
        <li>
          <strong>Numbers that should be strings.</strong> A version like <code>3.10</code> may be parsed as
          the number <code>3.1</code>, dropping the trailing zero. Quote it: <code>"3.10"</code>.
        </li>
        <li>
          <strong>Tabs.</strong> YAML forbids tabs for indentation — use spaces only, and be consistent.
        </li>
      </ul>
      <blockquote>
        When in doubt, quote the value. Explicit quoting removes ambiguity and prevents type-inference
        surprises.
      </blockquote>

      <h2>Converting safely</h2>
      <ol>
        <li>Validate the source first — malformed JSON or YAML will not convert cleanly.</li>
        <li>Convert, then read the output to confirm structure and types survived.</li>
        <li>Re-quote any value that must stay a string (versions, country codes, leading-zero numbers).</li>
        <li>Add comments back into YAML if you converted from JSON, since JSON cannot carry them.</li>
      </ol>

      <h2>Try it</h2>
      <p>
        The <Link to="/workspace/json-yaml-converter">DevBox JSON ⇄ YAML Converter</Link> translates in both
        directions instantly, and the <Link to="/workspace/json-formatter">JSON Formatter</Link> helps you
        validate the JSON side before you convert. For the full picture on JSON itself, read the{" "}
        <Link to="/guides/json-formatting">JSON formatting guide</Link>.
      </p>
    </GuideLayout>
  );
}
