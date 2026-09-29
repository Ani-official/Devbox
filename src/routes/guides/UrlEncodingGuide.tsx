import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "Why did a + in my query string turn into a space?",
    a: "Because it was decoded using application/x-www-form-urlencoded rules, where + means an encoded space. That convention comes from HTML form submission, not from RFC 3986. If you actually meant a literal plus sign in a form-encoded value, you had to send %2B.",
  },
  {
    q: "Should I use encodeURIComponent or encodeURI?",
    a: "Almost always encodeURIComponent, and only on one value at a time — a query parameter, a path segment, a fragment. Use encodeURI only when you already have a complete, structurally valid URI and just want to escape a few stray characters like spaces, since it deliberately leaves : / ? & = # unescaped.",
  },
  {
    q: "Why do I see %2520 in my server logs instead of %20?",
    a: "That is double-encoding. Something took an already-encoded %20 and ran it through a percent-encoding function a second time, which encodes the % character itself into %25, leaving %2520. If you see repeated %25 sequences, trace back through your code for a spot where a value gets encoded twice.",
  },
  {
    q: "Why does encoding é produce two %XX groups instead of one?",
    a: "Percent-encoding works on bytes, not characters. é is not one byte — in UTF-8 it is the two bytes 0xC3 0xA9 — so encoding it produces %C3%A9. A single non-ASCII character can expand into two, three, or four %XX groups depending on how many bytes its UTF-8 representation uses.",
  },
  {
    q: "Do I need to encode a literal & inside a query parameter value?",
    a: "Yes. & is a reserved character that separates key=value pairs in a query string. If a value legitimately contains &, it must be percent-encoded to %26, otherwise the parser will read it as the start of a new parameter and split your value in the wrong place.",
  },
  {
    q: "Is it safe to percent-encode unreserved characters like letters and digits?",
    a: "It is not wrong, but it is pointless and can trip up naive string-matching code. Unreserved characters (A-Z, a-z, 0-9, -, _, ., ~) are guaranteed never to need encoding under RFC 3986, and encoders like encodeURIComponent already leave them alone.",
  },
];

export default function UrlEncodingGuide() {
  return (
    <GuideLayout
      title="URL Encoding and Percent-Encoding: What Actually Gets Escaped and Why"
      description="How percent-encoding actually works at the byte level, why + means space in forms but not paths, and the double-encoding bug that produces %2520 in your logs."
      canonicalPath="/guides/url-encoding"
      readingTime="9 min read"
      faqs={faqs}
      relatedTools={[
        { label: "cURL to fetch/axios Converter", to: "/workspace/curl-converter" },
      ]}
      relatedGuides={[
        { label: "Character Encoding Explained", to: "/guides/character-encoding" },
        { label: "The Anatomy of an HTTP Request", to: "/guides/http-request-anatomy" },
      ]}
    >
      <p>
        A query string that worked fine locally arrives at production with a mangled parameter — a{" "}
        <code>+</code> became a space, an <code>&amp;</code> split a value in half, or a <code>%20</code>{" "}
        somehow turned into <code>%2520</code>. Every one of these is percent-encoding behaving exactly as
        specified. The bug is almost always that some layer of the stack applied the wrong rules, applied them
        twice, or didn't apply them at all. This guide covers the mechanics precisely enough that you can spot
        which of those three happened.
      </p>

      <h2>The actual mechanic</h2>
      <p>
        A URL is defined as a sequence of characters drawn from a limited, mostly-ASCII set. Anything outside
        that set — a space, a non-ASCII letter, a raw control character, or a reserved delimiter used as literal
        data — cannot appear as-is. Percent-encoding is the escape mechanism: take the byte value of the
        character, and replace it with <code>%</code> followed by that byte's two-digit hexadecimal value,
        written in uppercase.
      </p>
      <p>
        A space is byte <code>0x20</code>, so it becomes <code>%20</code>. That's the whole rule for a
        single-byte ASCII character. It gets more interesting once the character isn't ASCII at all.
      </p>
      <pre>
        <code>{`Character:        é
UTF-8 bytes:      0xC3 0xA9
Percent-encoded:  %C3%A9`}</code>
      </pre>
      <p>
        Percent-encoding operates on <strong>bytes</strong>, not on characters. Before anything gets encoded,
        the character has to be converted to a byte sequence using some encoding — on the modern web that's
        always UTF-8. The letter <code>é</code> is not one byte; in UTF-8 it's the two bytes{" "}
        <code>0xC3</code> and <code>0xA9</code>. Each of those bytes gets its own <code>%XX</code> group, which
        is why encoding a single accented letter, emoji, or CJK character produces multiple percent-encoded
        groups in the URL — two for most Latin-adjacent accented characters, three for most CJK characters,
        four for characters outside the Basic Multilingual Plane. If you ever see a URL like{" "}
        <code>%E4%BD%A0%E5%A5%BD</code>, that's two Chinese characters, six UTF-8 bytes, six{" "}
        <code>%XX</code> groups — not six separate characters.
      </p>

      <h2>Reserved vs. unreserved characters</h2>
      <p>
        RFC 3986 splits the characters a URL can use into two groups, and the distinction is the basis for
        almost every encoding decision you'll make.
      </p>
      <p>
        <strong>Unreserved characters</strong> — <code>A-Z</code>, <code>a-z</code>, <code>0-9</code>,{" "}
        <code>-</code>, <code>_</code>, <code>.</code>, <code>~</code> — never carry any structural meaning.
        They never need to be encoded, and an encoder is never required to touch them. If you see one of these
        percent-encoded (like <code>%7E</code> for <code>~</code>), it's harmless but unnecessary.
      </p>
      <p>
        <strong>Reserved characters</strong> — <code>: / ? # [ ] @ ! $ &amp; ' ( ) * + , ; =</code> — are
        reserved precisely because they're used as delimiters that give a URI its structure: <code>:</code>{" "}
        separates scheme from the rest, <code>/</code> separates path segments, <code>?</code> starts the
        query, <code>#</code> starts the fragment, <code>&amp;</code> and <code>=</code> separate query
        parameters and their values, and so on.
      </p>
      <p>
        The rule that trips people up: a reserved character is only safe to leave bare when it's actually
        playing its delimiter role. The moment it appears as literal <em>data</em> inside a component, it must
        be percent-encoded, or the parser reading the URL will misinterpret it as structure. A query value that
        contains a literal ampersand — say, a search term of <code>"salt &amp; pepper"</code> — has to encode
        that ampersand as <code>%26</code>. Left bare, <code>q=salt &amp; pepper</code> reads as two separate
        parameters, <code>q=salt</code> and a stray <code>pepper</code>, and the second half of your search
        term is silently dropped.
      </p>

      <h2>The + character is not part of RFC 3986</h2>
      <p>
        This is the single most common source of confusion in this entire topic, so it's worth being exact
        about where the rule comes from. RFC 3986 says nothing special about <code>+</code> — it's just a
        reserved character, and in most contexts (notably a URL <em>path</em>) a literal <code>+</code> is a
        literal plus sign and doesn't need encoding at all.
      </p>
      <p>
        The "<code>+</code> means space" convention comes from a completely different, older spec:{" "}
        <code>application/x-www-form-urlencoded</code>, the encoding HTML forms use for their submitted data
        (originally an early HTML/CGI convention, now formalized in the WHATWG URL Living Standard). That
        format was designed to encode form field values compactly, and it made a deliberate substitution: a
        space is written as <code>+</code> instead of <code>%20</code>, and any literal <code>+</code> in the
        data has to be escaped as <code>%2B</code> so it isn't misread as an encoded space.
      </p>
      <p>
        The two rules only collide because both encodings show up in the same place — a URL's query string —
        depending on how that query string was built. A query string generated by serializing an HTML form (or
        by <code>URLSearchParams</code>, or by most server-side form parsers) follows{" "}
        <code>x-www-form-urlencoded</code> rules, where <code>+</code> is space. A query string built by hand
        with plain RFC 3986 percent-encoding treats <code>+</code> as a literal plus sign, and expects spaces
        to be <code>%20</code>. Mixing the two — encoding a space as <code>%20</code> but then having a
        downstream parser decode the query using form rules, or vice versa — is exactly the bug behind "why did
        my + turn into a space" and its mirror image, "why is my space showing up as a literal plus."
      </p>

      <h2>encodeURIComponent vs. encodeURI</h2>
      <p>
        JavaScript ships two built-in encoders, and they exist for genuinely different jobs — using the wrong
        one is a very common, very quiet bug because it doesn't throw, it just corrupts structure.
      </p>
      <p>
        <code>encodeURIComponent</code> escapes everything except unreserved characters. It assumes the string
        you're passing it is a single opaque value — a query parameter's value, a path segment, a fragment
        payload — with no URL structure of its own. That's why it aggressively encodes <code>&amp;</code>,{" "}
        <code>=</code>, <code>?</code>, <code>/</code>, and <code>#</code>: as far as it knows, those are just
        data.
      </p>
      <p>
        <code>encodeURI</code> assumes the opposite: that you're handing it an already-structured, complete
        URI and just want to clean up stray unsafe characters (spaces, non-ASCII text) without breaking the
        structure that's already there. So it deliberately leaves reserved delimiters — <code>: / ? # &amp; =</code>{" "}
        and a few others — unescaped.
      </p>
      <pre>
        <code>{`const value = "a=b&c d";

encodeURIComponent(value);
// "a%3Db%26c%20d"   -- every reserved char and the space are escaped

encodeURI(value);
// "a=b&c%20d"       -- only the space is escaped; = and & pass through untouched`}</code>
      </pre>
      <p>
        Run <code>encodeURI</code> on something that's actually a single query value, and any <code>&amp;</code>{" "}
        or <code>=</code> the value contains passes straight through unescaped, so it gets parsed as extra
        parameters instead of part of your data. The fix is almost always: use{" "}
        <code>encodeURIComponent</code> on each value individually before assembling the query string yourself,
        or skip manual encoding altogether and build the query with <code>URLSearchParams</code>, which handles
        this correctly.
      </p>

      <h2>Double-encoding</h2>
      <p>
        Percent-encoding is not idempotent, and that's the root of the second most common bug in this space. If
        a value is already percent-encoded and gets passed through an encoding function again, the{" "}
        <code>%</code> character itself — byte <code>0x25</code> — gets encoded, because as far as the encoder
        is concerned, <code>%</code> is just another character it doesn't recognize as safe.
      </p>
      <pre>
        <code>{`Original space:        " "
Encoded once:          "%20"
Encoded again:         "%2520"   (the % in %20 became %25)`}</code>
      </pre>
      <p>
        The concrete symptom is diagnostic: if you're staring at server logs or a captured request and you see
        literal <code>%25XX</code> sequences — <code>%2520</code>, <code>%252F</code>, <code>%253D</code> —
        something in the pipeline encoded a value that was already encoded. Common culprits are a proxy or
        framework that automatically encodes outgoing URLs combined with application code that also calls{" "}
        <code>encodeURIComponent</code> manually, or a value getting encoded once when it's stored and again
        when it's later placed into a new URL. The fix is to find the layer doing redundant work and encode the
        raw, undecoded value exactly once, at the point where it's inserted into the URL.
      </p>

      <h2>Try it</h2>
      <p>
        If you're debugging a request that has a suspicious query string — plus signs, stray ampersands, or
        %2520-looking noise — the <Link to="/workspace/curl-converter">cURL to fetch/axios Converter</Link>{" "}
        is a fast way to turn a captured request into code you can actually step through and see exactly which
        value is getting encoded, and how many times.
      </p>
    </GuideLayout>
  );
}
