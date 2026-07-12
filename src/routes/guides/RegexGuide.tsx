import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "Do I include the slashes when testing a regex?",
    a: "No. In many languages a regex literal is written between slashes, like /\\d+/g. When you test a pattern, enter only the part between the slashes (\\d+) in the pattern field and put the flags (g) in the flags field.",
  },
  {
    q: "What is the difference between greedy and lazy matching?",
    a: "Quantifiers like * and + are greedy: they match as much as possible. Adding a ? makes them lazy, matching as little as possible. For example, against '<a><b>', the pattern <.+> matches the whole string, while <.+?> matches just '<a>'.",
  },
  {
    q: "Why does my pattern match too much?",
    a: "Usually because a greedy quantifier is grabbing more than you intended, or because . matches almost any character. Anchor your pattern (^ and $), use character classes instead of ., or switch to lazy quantifiers to tighten the match.",
  },
  {
    q: "Are regular expressions the same in every language?",
    a: "The core syntax is very similar across JavaScript, Python, Java, and PCRE, but flags, lookbehind support, and Unicode handling differ. A pattern that works in one engine may need small adjustments in another.",
  },
  {
    q: "Should I use regex to parse HTML or JSON?",
    a: "No. HTML and JSON are nested structures that regular expressions cannot reliably parse. Use a dedicated parser (DOMParser, JSON.parse) instead. Regex is best for flat, line-oriented text like log lines, IDs, and simple validation.",
  },
];

export default function RegexGuide() {
  return (
    <GuideLayout
      title="Regex Testing: Flags, Groups, and Debugging"
      description="A practical guide to testing regular expressions — how flags change matching, how capture groups work, and how to debug patterns that match too much or too little."
      canonicalPath="/guides/regex-testing"
      readingTime="7 min read"
      faqs={faqs}
      relatedTools={[
        { label: "Regex Tester & Debugger", to: "/workspace/regex-tester" },
        { label: "cURL Converter", to: "/workspace/curl-converter" },
      ]}
      relatedGuides={[
        { label: "cURL to fetch and axios", to: "/guides/curl-to-fetch" },
        { label: "JSON formatting explained", to: "/guides/json-formatting" },
      ]}
    >
      <p>
        Regular expressions are one of the most powerful tools a developer has for working with text — and one
        of the easiest to get subtly wrong. A pattern that looks correct can silently match too much, miss an
        edge case, or behave differently depending on a single flag. The fastest way to build a pattern you
        trust is to test it against real input and watch what it matches, character by character.
      </p>
      <p>
        This guide explains how flags change behavior, how capture groups extract data, the classic mistakes
        that make patterns match too much, and a workflow for debugging them.
      </p>

      <h2>Anatomy of a pattern</h2>
      <p>
        A regex is a small language for describing text. Consider a pattern that matches a simple email:
      </p>
      <pre>
        <code>{`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}`}</code>
      </pre>
      <p>Reading it left to right:</p>
      <ul>
        <li>
          <code>[a-zA-Z0-9._%+-]+</code> — one or more characters allowed in the local part.
        </li>
        <li>
          <code>@</code> — a literal at-sign.
        </li>
        <li>
          <code>[a-zA-Z0-9.-]+</code> — the domain name.
        </li>
        <li>
          <code>{"\\.[a-zA-Z]{2,}"}</code> — a dot followed by a top-level domain of at least two letters.
        </li>
      </ul>
      <p>
        You do not need to memorize this. The point of a tester is to build the pattern incrementally and
        confirm each piece behaves as expected before moving on.
      </p>

      <h2>Flags change everything</h2>
      <p>
        Flags are single letters that modify how the whole pattern is applied. The five you will use most:
      </p>
      <table>
        <thead>
          <tr>
            <th>Flag</th>
            <th>Name</th>
            <th>Effect</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>g</code></td>
            <td>Global</td>
            <td>Find every match, not just the first.</td>
          </tr>
          <tr>
            <td><code>i</code></td>
            <td>Case-insensitive</td>
            <td>Treat uppercase and lowercase as equal.</td>
          </tr>
          <tr>
            <td><code>m</code></td>
            <td>Multiline</td>
            <td>Make ^ and $ match the start/end of each line, not the whole string.</td>
          </tr>
          <tr>
            <td><code>s</code></td>
            <td>Dotall</td>
            <td>Let . match newline characters too.</td>
          </tr>
          <tr>
            <td><code>u</code></td>
            <td>Unicode</td>
            <td>Enable full Unicode matching (needed for emoji and many scripts).</td>
          </tr>
        </tbody>
      </table>
      <p>
        The <code>g</code> and <code>m</code> flags are the ones people forget most. Without <code>g</code>,
        you only ever get the first match. Without <code>m</code>, <code>^</code> anchors to the start of the
        entire input rather than each line — a common surprise when processing log files.
      </p>

      <h2>Capture groups: extracting data</h2>
      <p>
        Parentheses create a <strong>capture group</strong> — a sub-match you can pull out separately. To
        split an ISO date into parts:
      </p>
      <pre>
        <code>{`(\\d{4})-(\\d{2})-(\\d{2})`}</code>
      </pre>
      <p>
        Against <code>2026-07-01</code> this captures <code>2026</code>, <code>07</code>, and <code>01</code>{" "}
        as groups 1, 2, and 3. Named groups make this clearer:
      </p>
      <pre>
        <code>{`(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})`}</code>
      </pre>
      <p>
        If you only need grouping for alternation or quantifiers but do not want to capture, use a
        non-capturing group <code>(?:...)</code> to keep your group numbers clean.
      </p>

      <h2>Why patterns match too much</h2>
      <p>
        The single most common regex bug is greedy matching. Quantifiers grab as much as they can:
      </p>
      <pre>
        <code>{`Pattern:  <.+>
Input:    <a href="x">link</a>
Matches:  <a href="x">link</a>   (the whole thing!)`}</code>
      </pre>
      <p>
        The <code>.+</code> consumed everything up to the last <code>&gt;</code>. Two fixes:
      </p>
      <ul>
        <li>
          <strong>Make it lazy:</strong> <code>{"<.+?>"}</code> stops at the first <code>&gt;</code>, matching
          just <code>&lt;a href="x"&gt;</code>.
        </li>
        <li>
          <strong>Be specific:</strong> <code>{"<[^>]+>"}</code> matches any character except <code>&gt;</code>,
          which is both faster and clearer.
        </li>
      </ul>
      <p>
        Being specific with character classes beats relying on <code>.</code> almost every time.
      </p>

      <h2>A debugging workflow</h2>
      <ol>
        <li>Start with a small, realistic sample of the text you want to match.</li>
        <li>Write the simplest pattern that could work, then add one piece at a time.</li>
        <li>Add flags one at a time so you can see exactly what each one changes.</li>
        <li>Test the edge cases: empty input, the longest realistic value, and near-misses that should NOT match.</li>
        <li>Only then wire the pattern into your code.</li>
      </ol>

      <h2>Common patterns to adapt</h2>
      <ul>
        <li>Integer: <code>{"-?\\d+"}</code></li>
        <li>Decimal number: <code>{"-?\\d+(\\.\\d+)?"}</code></li>
        <li>Hex color: <code>{"#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})"}</code></li>
        <li>Slug: <code>{"[a-z0-9]+(?:-[a-z0-9]+)*"}</code></li>
        <li>ISO date: <code>{"\\d{4}-\\d{2}-\\d{2}"}</code></li>
      </ul>
      <p>
        Treat these as starting points, not gospel — always validate against your real data.
      </p>

      <h2>When not to use regex</h2>
      <p>
        Regular expressions describe <em>flat</em> patterns. They cannot reliably parse nested structures like
        HTML, XML, or JSON, because those can nest to arbitrary depth. Use a real parser for structured data
        and save regex for line-oriented text: log entries, identifiers, tokens, and simple validation.
      </p>

      <h2>Try it</h2>
      <p>
        The <Link to="/workspace/regex-tester">DevBox Regex Tester</Link> highlights matches live as you type
        and lets you toggle flags instantly, so you can see the effect of every change. Pair it with the{" "}
        <Link to="/guides/curl-to-fetch">cURL to fetch guide</Link> when you need to extract values from API
        responses.
      </p>
    </GuideLayout>
  );
}
