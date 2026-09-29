import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "Why groups of 3 bytes specifically, and not 2 or 4?",
    a: "Because 3 bytes and 4 six-bit characters both land on 24 bits with nothing left over. 24 is the least common multiple of 8 (bits per byte) and 6 (bits per Base64 character). Any other grouping either wastes bits or forces fractional characters, which is exactly the problem padding exists to solve at the edges of a stream.",
  },
  {
    q: "What does the '=' padding character actually encode?",
    a: "Nothing. It carries no data at all — it is a placeholder telling the decoder 'the last real group had fewer than 3 input bytes, so ignore the zero-bits I stuffed in to fill out the last sextet.' A decoder that already knows the exact byte length (many binary protocols do) can skip padding entirely, which is why Base64URL usually drops it.",
  },
  {
    q: "Why 64 characters and not some other number?",
    a: "6 bits gives exactly 2^6 = 64 possible values (0-63), and 6 is the largest bit-width that divides evenly into a byte-aligned grouping while still mapping onto printable, transport-safe ASCII. 64 printable characters (A-Z, a-z, 0-9, +, /) is what you get when you need every value representable by 6 bits.",
  },
  {
    q: "Does decoding do the same bit shifting in reverse?",
    a: "Yes. The decoder looks up each character's 6-bit index in the alphabet, concatenates four indices back into 24 bits, then reads that back out as three 8-bit bytes. It is the identical shift-and-mask operation run backwards, which is why Base64 round-trips losslessly — no information is discarded except for padding bookkeeping.",
  },
  {
    q: "Is Base64 output the same across all machines, regardless of endianness?",
    a: "Yes, and this trips people up because they expect byte-order issues like with UTF-16. Base64 has no concept of multi-byte words — it treats the input as a flat, ordered stream of individual bytes and slices bits off that stream in a fixed left-to-right order. There is no native byte order to get wrong.",
  },
  {
    q: "Can I use Base64 to compress data?",
    a: "No — it does the opposite. Base64 has no notion of redundancy elimination; it is a fixed 6-bits-in-8-bits-out remapping that always expands data by exactly 4/3. If you want smaller output, compress first (gzip, deflate) and Base64-encode the compressed bytes afterward, accepting the expansion on the smaller payload.",
  },
];

export default function Base64MechanicsGuide() {
  return (
    <GuideLayout
      title="The Bit-Level Mechanics of Base64 Encoding"
      description="A bit-by-bit walkthrough of how Base64 actually works: byte-to-sextet regrouping, the Man to TWFu worked example, padding math, and Base64URL."
      canonicalPath="/guides/base64-bit-mechanics"
      readingTime="9 min read"
      faqs={faqs}
      relatedTools={[
        { label: "Base64 Encoder / Decoder", to: "/workspace/base64-tool" },
      ]}
      relatedGuides={[
        { label: "Base64 Encoding, Explained", to: "/guides/base64-encoding" },
        { label: "Character Encoding Explained", to: "/guides/character-encoding" },
      ]}
    >
      <p>
        The <Link to="/guides/base64-encoding">practical Base64 guide</Link> covers when and why you'd reach
        for Base64 — data URIs, JWTs, email attachments. This one is about the part most explanations skip:
        what is actually happening to the bits. If you've ever tried to implement an encoder by hand, or
        debugged a decoder that choked on a truncated string, you know the practical explanation isn't enough.
        The whole scheme comes down to one idea: Base64 doesn't care about your bytes as bytes. It re-slices
        the same bit stream into a different-sized unit.
      </p>

      <h2>The core mechanic: regrouping bits, not bytes</h2>
      <p>
        A byte is 8 bits. A Base64 character encodes 6 bits. Those two numbers don't share a clean multiple
        against each other individually — but line up 3 bytes and 4 sextets side by side and both equal 24
        bits. That's the entire trick: Base64 takes input <strong>3 bytes at a time (24 bits)</strong>, ignores
        the original byte boundaries completely, and re-slices that same run of 24 bits into{" "}
        <strong>four new 6-bit chunks</strong>. Each 6-bit chunk is a number from 0 to 63, and each of those 64
        values maps to one printable character: <code>A–Z</code> (0–25), <code>a–z</code> (26–51),{" "}
        <code>0–9</code> (52–61), then <code>+</code> (62) and <code>/</code> (63).
      </p>
      <p>
        Nothing about the original 8-bit byte boundaries survives in the output — a Base64 character almost
        never corresponds to "half a byte" or "a byte plus a bit" in any meaningful way. It corresponds to a
        6-bit window that was cut out of a continuous bitstream without regard for where the input bytes
        started and stopped. That reframing — byte-boundaries are irrelevant, only the bit stream matters — is
        the one insight that makes the rest of the scheme (including the padding rules) fall into place.
      </p>

      <h2>Worked example: encoding "Man"</h2>
      <p>
        This is the standard example for a reason — three bytes divides evenly, so there's no padding to
        complicate the first pass. Start with the ASCII codes and their 8-bit binary forms:
      </p>
      <pre>
        <code>{`'M' = 77  = 01001101
'a' = 97  = 01100001
'n' = 110 = 01101110`}</code>
      </pre>
      <p>Concatenate all 24 bits into a single stream, byte boundaries erased:</p>
      <pre>
        <code>{`010011010110000101101110`}</code>
      </pre>
      <p>Now re-slice that same 24-bit stream into four groups of 6 bits, left to right:</p>
      <pre>
        <code>{`010011  010110  000101  101110`}</code>
      </pre>
      <p>Convert each 6-bit group to its decimal value, then look it up in the Base64 alphabet:</p>
      <pre>
        <code>{`010011 = 19  ->  'T'   (A=0 ... T=19)
010110 = 22  ->  'W'   (U=20, V=21, W=22)
000101 = 5   ->  'F'   (A=0 ... F=5)
101110 = 46  ->  'u'   (a=26, so 46-26=20th letter after a -> u)

Result: "TWFu"`}</code>
      </pre>
      <p>
        That's the whole algorithm. No lookup tables beyond the 64-character alphabet, no special cases — just
        cut 24 bits into four 6-bit windows and translate each one. Decoding is the identical operation run in
        reverse: look up each character's index (0–63), lay the four 6-bit values back end to end into 24
        bits, then read that stream back out as three 8-bit bytes.
      </p>

      <h2>Why the output is ~33% larger</h2>
      <p>
        Every 3 input bytes become 4 output characters. Each output character is stored as one byte (Base64
        output is plain ASCII text), so the size ratio is exactly <strong>4/3 ≈ 1.333</strong>. There's no way
        around this without changing the alphabet size: it's a direct consequence of spending a whole 8-bit
        byte to store something that only carries 6 bits of information. You're paying 2 bits of overhead per
        output byte in exchange for "this data is now safe to put in a text-only channel." For 3 bytes in, you
        always get 4 characters out (before padding); there is no shortcut, no case where Base64 output is
        smaller than or equal to its input.
      </p>

      <h2>Padding: when the input isn't a multiple of 3</h2>
      <p>
        The 3-bytes-in/4-chars-out grouping only works cleanly when the total input length is divisible by 3.
        Real input rarely cooperates, so the last group is either 1 or 2 bytes short, and the scheme needs a
        way to signal "this last group was incomplete" — that's what <code>=</code> padding is for. Crucially,
        the padding characters carry zero information; they exist purely so a decoder that doesn't already know
        the exact byte length can tell how many of the trailing bits were real versus filler.
      </p>
      <p>
        <strong>One leftover byte.</strong> Encoding just "M" (01001101, 8 bits): there aren't enough bits for
        even two full 6-bit groups, so the 8 bits are padded on the right with 4 zero bits to make 12 bits —
        enough for exactly two 6-bit characters. The other two character slots that a full group would have
        produced are filled with <code>=</code>:
      </p>
      <pre>
        <code>{`'M' = 01001101 -> pad to 12 bits: 010011 010000
010011 = 19 -> 'T'
010000 = 16 -> 'Q'
Result: "TQ=="`}</code>
      </pre>
      <p>
        <strong>Two leftover bytes.</strong> Encoding "Ma" (01001101 01100001, 16 bits): that's enough for two
        full 6-bit groups plus 4 leftover bits, which get padded with 2 zero bits to make a third 6-bit group.
        The one remaining character slot becomes a single <code>=</code>:
      </p>
      <pre>
        <code>{`'M''a' = 0100110101100001 -> pad to 18 bits: 010011 010110 000100
010011 = 19 -> 'T'
010110 = 22 -> 'W'
000100 = 4  -> 'E'
Result: "TWE="`}</code>
      </pre>
      <p>
        Notice the padded zero bits are never part of the original data — they're filler needed only to reach
        a whole 6-bit boundary, and the decoder discards exactly that many bits based on how many{" "}
        <code>=</code> characters it sees (two <code>=</code> means "the last real group was 1 byte," one{" "}
        <code>=</code> means "2 bytes," no <code>=</code> means the input divided evenly by 3).
      </p>

      <h2>Standard alphabet vs. Base64URL</h2>
      <p>
        RFC 4648 defines the base alphabet described above, but characters 62 and 63 (<code>+</code> and{" "}
        <code>/</code>) are a problem in contexts where those symbols already mean something: <code>+</code>{" "}
        can be interpreted as a space in URL query strings, and <code>/</code> is a path separator. RFC 4648
        §5 defines <strong>Base64URL</strong>, which swaps those two characters only:
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
          <tr><td>Value 62</td><td><code>+</code></td><td><code>-</code></td></tr>
          <tr><td>Value 63</td><td><code>/</code></td><td><code>_</code></td></tr>
          <tr><td>Padding</td><td><code>=</code> required</td><td>Often stripped</td></tr>
          <tr><td>Typical use</td><td>MIME/email, generic binary-to-text</td><td>JWTs, URL query params, filenames</td></tr>
        </tbody>
      </table>
      <p>
        Every other value (0–61) maps to the same character in both variants — this is a swap of exactly two
        symbols, not a different algorithm. JWTs use Base64URL for the header and payload segments specifically
        because a JWT is routinely passed around as a URL query parameter or an <code>Authorization</code>{" "}
        header value, where a stray <code>/</code> or <code>+</code> would need percent-encoding and bloat the
        token further. Padding is also commonly omitted in Base64URL contexts because the consuming code
        usually already knows the segment boundaries from delimiters (like the dots in a JWT), so the
        "how many bytes were in the last group" signal that <code>=</code> exists to provide isn't needed.
      </p>

      <h2>It's encoding, not encryption — and not compression</h2>
      <p>
        This is worth being blunt about because it's a genuinely common misconception: Base64 has no key, no
        secret, and no configurable parameter of any kind. The mapping from 6-bit value to character is fixed
        and public. Anyone who recognizes a Base64 string can decode it in one line of code — there's nothing
        to brute-force because there's nothing hidden. If a system Base64-encodes a password or token "for
        security," it has added zero confidentiality; it's added exactly the string transformation described
        above and nothing else. Encrypt first, with a real algorithm and a real key, if you need
        confidentiality — then Base64-encode the ciphertext afterward if you need it to survive a text-only
        channel. Similarly, Base64 is not compression: it has no model of redundancy and, as shown above,
        strictly increases size. The two problems (confidentiality, size) require different tools; Base64
        solves neither — it solves "how do I write arbitrary bytes using only printable characters."
      </p>

      <h2>Doing it in code: it's just shifts and masks</h2>
      <p>
        Stripped of edge-case handling, an encoder is bit-shifting three bytes into a 24-bit integer, then
        masking out 6 bits at a time:
      </p>
      <pre>
        <code>{`const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function encodeTriplet(b0, b1, b2, hasB1, hasB2) {
  // Pack up to 3 bytes into a 24-bit integer (missing bytes become 0).
  const n = (b0 << 16) | ((hasB1 ? b1 : 0) << 8) | (hasB2 ? b2 : 0);

  // Pull out four 6-bit windows: bits 18-23, 12-17, 6-11, 0-5.
  const c0 = (n >> 18) & 0x3f;
  const c1 = (n >> 12) & 0x3f;
  const c2 = (n >> 6) & 0x3f;
  const c3 = n & 0x3f;

  return (
    ALPHABET[c0] +
    ALPHABET[c1] +
    (hasB1 ? ALPHABET[c2] : "=") +
    (hasB2 ? ALPHABET[c3] : "=")
  );
}`}</code>
      </pre>
      <p>
        Every production Base64 implementation you've ever called — <code>btoa</code>,{" "}
        <code>Buffer.from(...).toString("base64")</code>, <code>base64.b64encode</code> — is doing this same
        shift-and-mask arithmetic, just with lookup tables and SIMD tricks for speed. The mental model doesn't
        change: pack three bytes into 24 bits, peel off four 6-bit windows, translate each one.
      </p>

      <h2>Where this came from: MIME and 7-bit transport</h2>
      <p>
        Base64 wasn't invented for JWTs or data URIs — both came decades later. Its origin is RFC 2045, part of
        the MIME specification from 1996, which needed a way to send arbitrary binary attachments (images,
        executables, compressed archives) through email transport that was only guaranteed to carry 7-bit
        ASCII cleanly. Many mail relays of that era would strip the 8th bit, translate line endings, or choke
        on control characters — any of which would silently corrupt raw binary data. By restricting the output
        alphabet to 64 characters that every 7-bit-clean transport could pass through untouched, MIME made it
        safe to attach a binary file to an email and have it arrive byte-for-byte intact on the other end. Every
        later use of Base64 — Basic auth, data URIs, JWTs — is really the same problem in a new context: some
        text-only channel needs to carry bytes that aren't text.
      </p>

      <h2>Try it</h2>
      <p>
        Working through the "Man" → "TWFu" math by hand once is worth more than reading about it twice — grab
        a few bytes of your own and trace the shifts. Or skip the arithmetic and check your work against the{" "}
        <Link to="/workspace/base64-tool">DevBox Base64 tool</Link>, which encodes and decodes instantly in
        the browser.
      </p>
    </GuideLayout>
  );
}
