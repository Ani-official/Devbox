import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "Why do I see characters like Ã© or ï¿½ instead of accented letters?",
    a: "That is classic mojibake: UTF-8 bytes being decoded as if they were Latin-1 or Windows-1252 (or vice versa). The byte sequence 0xC3 0xA9 is the valid UTF-8 encoding of é, but a Latin-1 decoder reads those same two bytes as two separate characters, Ã and ©, and prints both.",
  },
  {
    q: "Is UTF-8 the same thing as Unicode?",
    a: "No. Unicode is the standard that assigns a numeric codepoint to every character (é is U+00E9, regardless of encoding). UTF-8 is one of several ways to turn those codepoints into bytes. UTF-16 and UTF-32 are others. Saying \"convert to Unicode\" is technically meaningless — you convert to a specific encoding of Unicode.",
  },
  {
    q: "Why does my JavaScript code split an emoji in half when I slice a string?",
    a: "JavaScript strings are UTF-16 internally, and .length counts 16-bit code units, not characters. Emoji above U+FFFF (like 😀, U+1F600) are stored as a surrogate pair — two code units. Slicing by a naive index can land between the two halves of the pair, producing an unpaired surrogate that renders as a broken glyph or replacement character.",
  },
  {
    q: "Why does JSON.parse fail on the very first character of a file that looks fine?",
    a: "The file almost certainly starts with a UTF-8 byte order mark (EF BB BF), often added silently by Windows editors like Notepad or Excel on save. Strict JSON parsers expect the first byte to be part of a token, not a BOM, so they throw immediately at position 0.",
  },
  {
    q: "Can every Unicode codepoint be represented in UTF-8?",
    a: "Yes, by design. UTF-8 can encode all 1,114,112 possible Unicode codepoints (U+0000 through U+10FFFF) using 1 to 4 bytes. That is one of the reasons it replaced the code-page approach — one encoding, no ambiguity, full coverage.",
  },
  {
    q: "Why is UTF-8 backward compatible with ASCII but Windows-1252 is not with Latin-1 in practice?",
    a: "Every ASCII byte (0-127) is also a valid, identical single-byte UTF-8 character, because UTF-8 was explicitly designed so any byte starting with 0 means 'this is a 1-byte, ASCII-range character.' Windows-1252 and Latin-1 both use the 128-255 range, but assign different characters to several of those positions, so files silently disagree even though both claim '8-bit ASCII-compatible.'",
  },
];

export default function CharacterEncodingGuide() {
  return (
    <GuideLayout
      title="Character Encoding Explained: ASCII, UTF-8, and Why Text Breaks"
      description="How ASCII, code pages, Unicode codepoints, UTF-8, and UTF-16 actually work at the bit level, and why mixing them produces mojibake and split emoji."
      canonicalPath="/guides/character-encoding"
      readingTime="10 min read"
      faqs={faqs}
      relatedTools={[
        { label: "Base64 Encoder / Decoder", to: "/workspace/base64-tool" },
        { label: "JSON Formatter & Validator", to: "/workspace/json-formatter" },
      ]}
      relatedGuides={[
        { label: "Base64 Encoding, Explained", to: "/guides/base64-encoding" },
        { label: "URL Encoding and Percent-Encoding", to: "/guides/url-encoding" },
      ]}
    >
      <p>
        Every developer eventually opens a file and sees <code>café</code> rendered as <code>cafÃ©</code>, or
        watches a Python script blow up with <code>UnicodeDecodeError</code>, or finds a JWT-adjacent JSON
        blob that <code>JSON.parse</code> refuses to touch even though it &quot;looks fine&quot; in the editor.
        None of this is random. Text is just bytes, and bytes only mean something once you know which rulebook
        was used to turn characters into them — and which rulebook you are using to turn them back. When those
        two rulebooks disagree, you get mojibake, split emoji, and parsers that die on byte zero. This guide
        goes through the actual bit patterns so the failures stop looking mysterious.
      </p>

      <h2>ASCII: 128 slots, and only 128</h2>
      <p>
        ASCII (American Standard Code for Information Interchange) is a 7-bit encoding. Seven bits give you{" "}
        <code>2^7 = 128</code> possible values, numbered 0 through 127, and ASCII assigns every single one of
        them a meaning. Codes 0-31 and 127 are control characters (tab, newline, carriage return, null, escape,
        and so on — not printable text at all). Codes 32-126 cover the printable set: space, digits{" "}
        <code>0-9</code>, uppercase <code>A-Z</code>, lowercase <code>a-z</code>, and the punctuation on a US
        keyboard. That is the entire alphabet. There is no slot for é, ñ, ü, ø, ß, or anything Cyrillic, Greek,
        Hebrew, Arabic, Devanagari, or Han. ASCII was built by and for a specific slice of the English-speaking
        computing world in the 1960s, and it physically cannot represent more than 128 distinct symbols — the
        7th bit simply is not there. Every byte in memory has 8 bits, so ASCII text always leaves the top bit
        set to 0 and wastes the other 128 possible byte values (128-255).
      </p>

      <h2>The code-page era: same bytes, different alphabets</h2>
      <p>
        Once computers needed to handle French, German, Russian, Greek, and everything else, vendors reused
        that unused top bit. An 8-bit byte can represent 256 values, so codes 128-255 became fair game — and
        every region, vendor, and OS filled them in differently. Latin-1 (ISO-8859-1) put Western European
        accented letters there. Windows-1252 did something similar but not identical (it swapped a handful of
        Latin-1&apos;s control-range slots for smart quotes and the euro sign). Separate code pages covered
        Cyrillic (Windows-1251, KOI8-R), Greek (ISO-8859-7), Hebrew, Turkish, and dozens more. None of these
        encodings knew about each other, and a plain byte stream carries no label saying which one was used.
      </p>
      <p>
        That is the actual root cause of classic mojibake: the byte value <code>0xE9</code> (233 decimal) is é
        under Windows-1252, but the same byte is a completely different character under a Cyrillic code page,
        and undefined under plain ASCII. If a French document gets saved as Windows-1252 and then opened by a
        program that assumes Latin-1 (or the other way around), most bytes match up by luck because the two
        overlap heavily, but the ones that do not produce garbage — recognizably wrong, but not obviously
        broken, which is what makes it insidious. Multiply this by dozens of incompatible 8-bit code pages and
        you get the pre-Unicode mess: no single encoding could hold text from more than one script family, and
        exchanging files across regions was a gamble.
      </p>

      <h2>Unicode&apos;s actual idea: separate the number from the bytes</h2>
      <p>
        Unicode fixes this with one conceptual move that most encoding confusion comes from missing:{" "}
        <strong>
          Unicode defines what a character is (a codepoint — an abstract number) completely separately from how
          that number gets turned into bytes (an encoding)
        </strong>
        . The codepoint for é is <code>U+00E9</code>. The codepoint for the grinning-face emoji is{" "}
        <code>U+1F600</code>. These numbers do not change no matter what encoding you use to store or transmit
        the text. What changes is the byte representation: UTF-8, UTF-16, and UTF-32 are three different,
        interchangeable ways of encoding the exact same set of codepoints. &quot;Convert this file to
        Unicode&quot; is a category error — Unicode is not a byte format, it is the numbering system. What you
        actually convert to is a specific encoding, almost always UTF-8 today.
      </p>

      <h2>UTF-8: variable width, self-describing bytes</h2>
      <p>
        UTF-8 encodes each codepoint using 1 to 4 bytes, and it is designed so you can tell how many bytes a
        character occupies just by looking at the leading bits of its first byte:
      </p>
      <pre>
        <code>{`1 byte:  0xxxxxxx                                  (codepoints U+0000   - U+007F)
2 bytes: 110xxxxx 10xxxxxx                         (codepoints U+0080   - U+07FF)
3 bytes: 1110xxxx 10xxxxxx 10xxxxxx                (codepoints U+0800   - U+FFFF)
4 bytes: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx        (codepoints U+10000  - U+10FFFF)`}</code>
      </pre>
      <p>
        Every continuation byte (the 2nd, 3rd, or 4th byte of a multi-byte character) starts with the bit
        pattern <code>10</code>, which is exactly how a decoder knows a byte is a continuation rather than the
        start of a new character. The 1-byte form starting with <code>0</code> is why UTF-8 is byte-for-byte
        identical to ASCII for codepoints 0-127 — an ASCII file is already a valid UTF-8 file, no conversion
        needed. That backward compatibility is the whole reason UTF-8 won over UTF-16 and UTF-32 for text on
        the web and in most file formats.
      </p>
      <p>Here is the worked example for é, codepoint U+00E9 (decimal 233):</p>
      <pre>
        <code>{`U+00E9 in binary (11 bits needed, right-padded to fit the 2-byte pattern):
  00E9  ->  000 11101001

Split across the 2-byte template  110xxxxx 10xxxxxx  (11 x's total):
  110 00011  10 101001

Which gives the two bytes:
  11000011  10101001
  =  0xC3     0xA9

So é (U+00E9) is encoded in UTF-8 as the two bytes: C3 A9`}</code>
      </pre>
      <p>
        That is exactly the pair of bytes a Latin-1 or Windows-1252 decoder misreads as two separate characters
        (<code>Ã</code> then <code>©</code>), which is why <code>café</code> becomes <code>cafÃ©</code> when a
        UTF-8 file gets opened under the wrong assumed encoding. Same bytes, two different rulebooks, two
        different results.
      </p>

      <h2>UTF-16 and the surrogate-pair bug you have probably shipped</h2>
      <p>
        UTF-16 stores most common characters (the Basic Multilingual Plane, roughly U+0000 to U+FFFF) as a
        single 16-bit unit. But Unicode has room for codepoints up to <code>U+10FFFF</code>, well past what one
        16-bit unit can hold. For those — most emoji included, like 😀 at <code>U+1F600</code> — UTF-16 uses a{" "}
        <strong>surrogate pair</strong>: two 16-bit code units, a &quot;high surrogate&quot; followed by a
        &quot;low surrogate,&quot; which only mean anything together. Neither half is a valid character on its
        own.
      </p>
      <p>
        JavaScript strings are UTF-16 internally, and <code>.length</code> counts 16-bit code units, not
        actual characters. 😀 has a <code>.length</code> of 2, not 1. That means naive code like{" "}
        <code>str.slice(0, 5)</code> or a character-by-character loop using indices can cut a string exactly
        between the two halves of a surrogate pair, leaving one dangling unpaired surrogate at the boundary.
        The result renders as a broken tofu box or the replacement character, and re-encoding it can even throw.
        This is why string truncation, byte-length limits (SMS-style character counters, database column
        limits), and naive substring logic are a recurring source of &quot;the emoji got mangled&quot; bug
        reports — the fix is to iterate by codepoint (for example with <code>for...of</code> or{" "}
        <code>Array.from(str)</code> in JavaScript) instead of by raw index.
      </p>

      <h2>The BOM: a marker that outstays its welcome</h2>
      <p>
        The byte order mark is the codepoint <code>U+FEFF</code>, which some tools write at the very start of a
        file to declare its encoding and, for UTF-16/UTF-32, its byte order (little-endian vs big-endian). In
        UTF-8 a BOM has no byte-order purpose at all — UTF-8 has no byte order to disambiguate — but some
        Windows tools (Notepad, Excel&apos;s &quot;CSV UTF-8&quot; export) still prepend the three bytes{" "}
        <code>EF BB BF</code> to signal &quot;this is UTF-8&quot; anyway. Most modern parsers strip a leading
        BOM silently. Strict ones do not: a strict <code>JSON.parse</code> or a CSV parser that expects the
        first character to be <code>{"{"}</code> or a header field will choke on those three invisible bytes
        and report a syntax error at position 0, even though the file &quot;looks empty at the start&quot; in a
        text editor that hides the marker.
      </p>

      <h2>Try it</h2>
      <p>
        If you want to see codepoint-versus-byte behavior firsthand, run some accented text or an emoji through
        the <Link to="/workspace/base64-tool">DevBox Base64 Encoder / Decoder</Link> and inspect the resulting
        bytes, or drop a file with a leading BOM into the{" "}
        <Link to="/workspace/json-formatter">JSON Formatter &amp; Validator</Link> to see exactly where strict
        parsing draws the line.
      </p>
    </GuideLayout>
  );
}
