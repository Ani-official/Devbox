import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "What is the difference between fetch and axios?",
    a: "fetch is built into browsers and Node 18+, returns a Response you must call .json() on, and does not throw on HTTP error statuses. axios is a library that parses JSON automatically, throws on 4xx/5xx by default, and supports interceptors and request cancellation out of the box.",
  },
  {
    q: "Why does fetch not throw on a 404?",
    a: "fetch only rejects on network failures, not HTTP error codes. A 404 or 500 still resolves successfully, so you must check response.ok (or response.status) yourself before reading the body.",
  },
  {
    q: "How do I send a JSON body with fetch?",
    a: "Set the Content-Type header to application/json and pass JSON.stringify(data) as the body. Forgetting either one is the most common reason a POST request fails.",
  },
  {
    q: "Can I convert any cURL command to fetch automatically?",
    a: "Simple commands with a method, headers, and a JSON body convert cleanly. Multipart uploads, cookies, client certificates, and shell-specific quoting often need manual review, so always read the generated code before shipping it.",
  },
  {
    q: "Should I commit the auth header from a cURL example?",
    a: "No. cURL examples from docs often include a real token or API key. Move secrets into environment variables and never commit them to source control.",
  },
];

export default function CurlToFetchGuide() {
  return (
    <GuideLayout
      title="Converting cURL to fetch and axios"
      description="Turn cURL commands from API docs into working JavaScript. Learn how methods, headers, and bodies map to fetch and axios — and what needs manual review before you ship."
      canonicalPath="/guides/curl-to-fetch"
      readingTime="6 min read"
      faqs={faqs}
      relatedTools={[
        { label: "cURL Converter", to: "/workspace/curl-converter" },
        { label: "JSON Formatter", to: "/workspace/json-formatter" },
      ]}
      relatedGuides={[
        { label: "Regex testing explained", to: "/guides/regex-testing" },
        { label: "Working with JWTs", to: "/guides/jwt-decoding" },
      ]}
    >
      <p>
        Almost every API documentation page gives you a <code>curl</code> example. It is a great way to try a
        request from the terminal, but at some point you need that request running inside an actual app. This
        guide shows how a cURL command maps onto JavaScript's <code>fetch</code> and the <code>axios</code>{" "}
        library, which parts translate cleanly, and which ones need a human eye.
      </p>

      <h2>A cURL command, piece by piece</h2>
      <p>Here is a typical POST request from an API doc:</p>
      <pre>
        <code>{`curl -X POST https://api.example.com/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"dev","password":"secret"}'`}</code>
      </pre>
      <p>Three things carry over to JavaScript:</p>
      <ul>
        <li>
          <strong>Method</strong> — <code>-X POST</code> becomes <code>method: "POST"</code>.
        </li>
        <li>
          <strong>Headers</strong> — each <code>-H</code> becomes an entry in the <code>headers</code> object.
        </li>
        <li>
          <strong>Body</strong> — the <code>-d</code> payload becomes the request <code>body</code>.
        </li>
      </ul>

      <h2>The fetch version</h2>
      <pre>
        <code>{`const res = await fetch("https://api.example.com/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "dev", password: "secret" }),
});

if (!res.ok) {
  throw new Error(\`Request failed: \${res.status}\`);
}
const data = await res.json();`}</code>
      </pre>
      <p>
        Two details trip people up. First, the body must be a <em>string</em> — hence{" "}
        <code>JSON.stringify</code>. Second, <code>fetch</code> does not throw on a 404 or 500; it only rejects
        on network errors. That is why the <code>if (!res.ok)</code> check is essential, not optional.
      </p>

      <h2>The axios version</h2>
      <pre>
        <code>{`import axios from "axios";

const { data } = await axios.post(
  "https://api.example.com/login",
  { username: "dev", password: "secret" },
  { headers: { "Content-Type": "application/json" } }
);`}</code>
      </pre>
      <p>
        axios does more for you: it serializes the body to JSON, sets the content type, parses the response,
        and throws automatically on 4xx and 5xx responses. That is less boilerplate, at the cost of an extra
        dependency.
      </p>

      <h2>fetch vs. axios at a glance</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>fetch</th>
            <th>axios</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Built in?</td>
            <td>Yes (browsers, Node 18+)</td>
            <td>No — a dependency</td>
          </tr>
          <tr>
            <td>JSON parsing</td>
            <td>Manual (<code>await res.json()</code>)</td>
            <td>Automatic</td>
          </tr>
          <tr>
            <td>Throws on 4xx/5xx</td>
            <td>No — check <code>res.ok</code></td>
            <td>Yes, by default</td>
          </tr>
          <tr>
            <td>Interceptors / cancellation</td>
            <td>Manual</td>
            <td>Built in</td>
          </tr>
        </tbody>
      </table>
      <p>
        For a couple of requests, <code>fetch</code> keeps your bundle lean. For a larger app with shared auth
        headers, retries, or request cancellation, axios's built-in features earn their place.
      </p>

      <h2>What needs manual review</h2>
      <p>Automated conversion handles the common case, but watch for these:</p>
      <ul>
        <li>
          <strong>Shell quoting.</strong> Single vs. double quotes and escaped characters in the terminal do
          not always map cleanly to JavaScript strings — double-check the body.
        </li>
        <li>
          <strong>Multipart uploads.</strong> <code>-F</code> file uploads need a <code>FormData</code> object,
          not a JSON body.
        </li>
        <li>
          <strong>Authentication.</strong> A <code>-H "Authorization: Bearer ..."</code> header from a doc
          often contains a live token. Move it to an environment variable before committing.
        </li>
        <li>
          <strong>Cookies and redirects.</strong> Flags like <code>--cookie</code> and <code>-L</code> have
          separate options in fetch/axios (<code>credentials</code>, redirect handling).
        </li>
      </ul>

      <h2>A safe workflow</h2>
      <ol>
        <li>Paste the cURL command into a converter to get a starting point.</li>
        <li>Read the generated code — confirm the method, headers, and body match your intent.</li>
        <li>Replace any hard-coded secrets with environment variables.</li>
        <li>Add error handling (<code>res.ok</code> for fetch; try/catch for axios).</li>
        <li>Test against a development endpoint before pointing it at production.</li>
      </ol>

      <h2>Try it</h2>
      <p>
        The <Link to="/workspace/curl-converter">DevBox cURL Converter</Link> generates both fetch and axios
        versions side by side so you can pick the one that fits your project. Format the response with the{" "}
        <Link to="/workspace/json-formatter">JSON Formatter</Link> to confirm the shape of the data you get
        back.
      </p>
    </GuideLayout>
  );
}
