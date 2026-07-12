import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "Is Base64 encryption?",
    a: "No. Base64 is an encoding, not encryption. It provides zero secrecy — anyone can decode it instantly. It exists to represent binary data safely as text, not to hide it.",
  },
  {
    q: "Why does Base64 make data larger?",
    a: "Base64 represents every 3 bytes of input as 4 ASCII characters, so encoded output is about 33% larger than the original. That is the trade-off for being safe to transmit through text-only channels.",
  },
  {
    q: "What is the difference between Base64 and Base64URL?",
    a: "Base64URL is a variant that replaces the + and / characters with - and _ and usually drops the = padding, so the result is safe to place in URLs and filenames. JWTs use Base64URL.",
  },
  {
    q: "When should I embed an image as a Base64 data URI?",
    a: "Data URIs work well for tiny, frequently used assets (small icons, placeholders) because they avoid an extra request. For larger images the 33% size increase and loss of caching usually make a normal file reference the better choice.",
  },
  {
    q: "Why did my Base64 string fail to decode?",
    a: "Common causes are missing padding, whitespace or line breaks in the string, or using standard Base64 to decode a Base64URL value (or vice versa). Trim the string and confirm you are using the matching variant.",
  },
];

export default function Base64Guide() {
  return (
    <GuideLayout
      title="Base64 Encoding, Explained"
      description="What Base64 is, why it exists, how it differs from encryption and Base64URL, and when to use data URIs — with practical examples for developers."
      canonicalPath="/guides/base64-encoding"
      readingTime="6 min read"
      faqs={faqs}
      relatedTools={[
        { label: "Base64 Encoder / Decoder", to: "/workspace/base64-tool" },
        { label: "JWT Decoder", to: "/workspace/jwt-decoder" },
      ]}
      relatedGuides={[
        { label: "Understanding JWTs", to: "/guides/jwt-decoding" },
        { label: "Optimizing SVGs for the web", to: "/guides/svg-optimization" },
      ]}
    >
      <p>
        Base64 is one of those technologies you use constantly without noticing: it is inside JWTs, email
        attachments, data URIs, and HTTP Basic auth. Yet it is widely misunderstood — most importantly, many
        people think it provides some kind of security. It does not. This guide explains what Base64 actually
        does, why it exists, and where it belongs in your toolkit.
      </p>

      <h2>The problem Base64 solves</h2>
      <p>
        Some systems are <em>text-only</em>. Email bodies, JSON strings, URLs, and many HTTP headers were
        designed to carry printable ASCII characters, not arbitrary binary bytes. If you drop raw binary data
        into those channels, bytes get corrupted, reinterpreted, or stripped.
      </p>
      <p>
        Base64 solves this by representing any binary data using just 64 safe, printable characters:{" "}
        <code>A–Z</code>, <code>a–z</code>, <code>0–9</code>, <code>+</code>, and <code>/</code>. The result is
        pure text that survives any channel that accepts ASCII.
      </p>

      <h2>How it works</h2>
      <p>
        Base64 takes input three bytes (24 bits) at a time and splits those 24 bits into four groups of six
        bits. Each 6-bit group (a value from 0 to 63) maps to one character in the Base64 alphabet. That is why
        output is always a multiple of four characters, and why <code>=</code> padding appears when the input
        length is not a multiple of three.
      </p>
      <pre>
        <code>{`Input text:   "Hi!"
Bytes:        72 105 33
Base64:       "SGkh"`}</code>
      </pre>
      <p>
        The consequence: every 3 bytes become 4 characters, so encoded data is roughly <strong>33% larger</strong>{" "}
        than the original. That size cost is the price of text-safety.
      </p>

      <h2>Base64 is not encryption</h2>
      <blockquote>
        Base64 offers no secrecy whatsoever. Anyone can decode it in a fraction of a second.
      </blockquote>
      <p>
        Because it is trivially reversible with no key, Base64 must never be used to protect passwords, tokens,
        or personal data. If you need confidentiality, use real encryption (for example AES) and treat Base64
        only as a way to make the encrypted bytes text-safe afterwards.
      </p>

      <h2>Base64 vs. Base64URL</h2>
      <p>
        Standard Base64 uses <code>+</code> and <code>/</code>, which have special meaning in URLs (and{" "}
        <code>/</code> is illegal in filenames). <strong>Base64URL</strong> is a small variant that swaps them
        for <code>-</code> and <code>_</code> and usually omits the <code>=</code> padding:
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Standard Base64</th>
            <th>Base64URL</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>62nd character</td><td><code>+</code></td><td><code>-</code></td></tr>
          <tr><td>63rd character</td><td><code>/</code></td><td><code>_</code></td></tr>
          <tr><td>Padding</td><td><code>=</code></td><td>Often omitted</td></tr>
          <tr><td>Used in</td><td>Email, data URIs</td><td>JWTs, URLs, filenames</td></tr>
        </tbody>
      </table>
      <p>
        Mixing the two is a common bug: a JWT segment (Base64URL) will not decode correctly with a strict
        standard-Base64 decoder, and vice versa.
      </p>

      <h2>Where you will meet Base64</h2>
      <ul>
        <li>
          <strong>Data URIs</strong> — embedding an image directly in HTML or CSS with{" "}
          <code>data:image/png;base64,...</code> to avoid an extra request.
        </li>
        <li>
          <strong>JWTs</strong> — the header and payload are Base64URL-encoded JSON.
        </li>
        <li>
          <strong>HTTP Basic auth</strong> — <code>Authorization: Basic</code> carries a Base64 of{" "}
          <code>username:password</code> (which is exactly why Basic auth requires HTTPS).
        </li>
        <li>
          <strong>Email attachments</strong> — MIME encodes binary attachments as Base64.
        </li>
      </ul>

      <h2>When to use a data URI (and when not to)</h2>
      <ul>
        <li>
          <strong>Good fit:</strong> tiny, reusable assets like a 1&nbsp;KB icon or an SVG placeholder, where
          saving a request outweighs the 33% size bump.
        </li>
        <li>
          <strong>Poor fit:</strong> large images. The size increase adds up, the asset cannot be cached
          separately, and it bloats your HTML/CSS. A normal <code>&lt;img&gt;</code> reference is better.
        </li>
      </ul>

      <h2>Try it</h2>
      <p>
        The <Link to="/workspace/base64-tool">DevBox Base64 Encoder / Decoder</Link> encodes and decodes text
        instantly in your browser. Because JWT segments are Base64URL, the{" "}
        <Link to="/guides/jwt-decoding">JWT guide</Link> is a natural next read.
      </p>
    </GuideLayout>
  );
}
