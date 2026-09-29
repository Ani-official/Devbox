import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "Why does JSON.parse fail on the first error instead of showing me all the mistakes at once?",
    a: "JSON.parse implements a strict, single-pass recursive-descent parser. It has no error-recovery mode: the moment the tokenizer or parser hits a token that doesn't match the current grammar rule, it throws a SyntaxError and unwinds the call stack. Finding a second error would require either speculative re-parsing after a guessed fix, or a separate lenient parser (which is exactly what tools like JSON5 or 'repair JSON' utilities do).",
  },
  {
    q: "Is tokenizing and parsing really done in two separate passes?",
    a: "Conceptually yes, though many real implementations interleave them for speed (a 'lexerless' or hand-fused parser that pulls one token at a time on demand). Logically, though, a JSON parser always has two distinct jobs: turning characters into tokens, and turning tokens into a value tree. Keeping them separate in your mental model — and usually in your code, even if a `nextToken()` function is called lazily — makes it much easier to reason about where a given error comes from.",
  },
  {
    q: "Why is a trailing comma invalid in JSON but fine in JavaScript object literals?",
    a: "They're different grammars. A JS object/array literal's comma-handling is defined by ECMAScript, which explicitly permits an elision after the last element in array literals and has historically been more permissive around trailing commas in object literals (since ES2017). JSON's grammar (RFC 8259 / ECMA-404) defines an object as `member (',' member)*` — the comma is strictly a separator between two members, not a terminator, so one with nothing after it has no valid production to match.",
  },
  {
    q: "What does JSON.parse's second argument (the reviver) actually do?",
    a: "The reviver is a function called once per key/value pair, bottom-up, after the entire tree has already been parsed and built. For each property (starting with the innermost/deepest ones and working up to the root, which is passed as the empty-string key), the reviver is called with (key, value) and its return value replaces the original in the resulting structure. Returning undefined deletes that key. It runs strictly after parsing succeeds — it can't influence tokenizing or fix a syntax error, it only post-processes an already-valid tree, commonly used to revive ISO date strings into Date objects.",
  },
  {
    q: "Can a JSON parser recover after hitting an error and keep going?",
    a: "A strict parser (JSON.parse, most standard-library JSON parsers) can't and won't — the spec defines JSON as a formal grammar with no error-recovery production. Lenient tools work around this by running a separate pre-pass that pattern-matches and rewrites common near-miss mistakes (trailing commas, unquoted keys, single quotes, comments) into valid JSON text before handing it to a real parser, or by implementing their own hand-rolled parser with recovery rules that skip or synthesize tokens and record diagnostics instead of throwing immediately.",
  },
  {
    q: "Why do parsers report 'line X, column Y' instead of a byte offset?",
    a: "A raw byte or character offset is technically sufficient but useless to a human staring at an editor. So the tokenizer maintains two counters as it scans: a line counter incremented on every newline character, and a column counter incremented per character and reset to 1 on newline. Every token records the (line, column) of its first character when it's produced, and when the parser rejects a token it reads that stamp back out and includes it in the thrown error.",
  },
];

export default function JsonParsingGuide() {
  return (
    <GuideLayout
      title="How JSON Parsers Work: Tokenizing, Validating, and Recovering from Errors"
      description="A deep dive into JSON parser internals: lexing raw text into tokens, recursive-descent parsing, why specific syntax mistakes fail where they do, and how error recovery works."
      canonicalPath="/guides/json-parsing-internals"
      readingTime="10 min read"
      faqs={faqs}
      relatedTools={[
        { label: "JSON Formatter & Validator", to: "/workspace/json-formatter" },
      ]}
      relatedGuides={[
        { label: "JSON Formatting: A Practical Guide", to: "/guides/json-formatting" },
        { label: "JSON vs YAML: When to Use Each", to: "/guides/json-yaml" },
      ]}
    >
      <p>
        Most explanations of "invalid JSON" stop at the symptom: a trailing comma is bad, single quotes are
        bad, unquoted keys are bad. That's true, but it treats the parser as a black box that mysteriously
        rejects certain inputs. It isn't a black box — it's two small, deterministic pieces of code, a
        tokenizer and a recursive-descent parser, each enforcing a formal grammar defined by RFC 8259 and its
        sibling standard ECMA-404. Once you see what those two pieces actually do character by character,
        every "Unexpected token" error stops looking arbitrary and starts looking like exactly what it is: a
        state machine refusing an input that doesn't match its rules.
      </p>

      <h2>Two passes: tokenizing, then parsing</h2>
      <p>
        No JSON parser works directly on the raw character stream when building structure. It first runs a
        lexer (tokenizer) that groups characters into a flat sequence of tokens, discarding insignificant
        whitespace along the way. Only then does a second stage — the parser proper — consume that token
        stream and assemble it into nested objects, arrays, and scalar values. Even implementations that
        interleave the two for performance (pulling one token at a time on demand rather than materializing
        the whole list up front) are still logically doing both jobs.
      </p>
      <p>
        The token set for JSON is small and fixed: structural characters <code>{`{ } [ ] : ,`}</code>, and four
        value-token kinds — STRING, NUMBER, and the two literal keywords <code>true</code>/<code>false</code>{" "}
        (often unified as a BOOLEAN token) and <code>null</code>. Take this input:
      </p>
      <pre>
        <code>{`{"id":42,"active":true}`}</code>
      </pre>
      <p>The tokenizer walks it left to right and emits:</p>
      <pre>
        <code>{`LBRACE        {
STRING        "id"
COLON         :
NUMBER        42
COMMA         ,
STRING        "active"
COLON         :
TRUE          true
RBRACE        }`}</code>
      </pre>
      <p>
        Notice what's already been decided at this point, before any object has been "built": the tokenizer
        had to decide where the string <code>"id"</code> ends (at the closing unescaped quote), where the
        number <code>42</code> ends (at the first character that isn't a digit — here, the comma), and that{" "}
        <code>true</code> is a complete keyword token, not the start of some longer identifier. Each of those
        decisions is a small grammar of its own — the NUMBER token alone has rules for an optional leading
        minus, no leading zeros before other digits, an optional fractional part, and an optional exponent.
        The parser that runs afterward never looks at a single raw character; it only ever sees this flat list
        of typed tokens.
      </p>

      <h2>Recursive descent: why the parser calls itself</h2>
      <p>
        JSON's grammar is recursive by definition: a value can be an object, and an object's members can have
        values that are themselves objects or arrays, to arbitrary depth. The natural implementation of a
        recursive grammar is a set of mutually recursive functions, one per grammar production, each calling
        back into the others (and ultimately into itself) as deeply as the input requires. This is called
        recursive-descent parsing, and it's how the overwhelming majority of JSON parsers — including the C++
        parser behind V8's <code>JSON.parse</code> — are structured:
      </p>
      <pre>
        <code>{`function parseValue(tokens) {
  const t = tokens.peek();
  switch (t.type) {
    case "LBRACE":  return parseObject(tokens);
    case "LBRACKET":return parseArray(tokens);
    case "STRING":  return parseString(tokens);
    case "NUMBER":  return parseNumber(tokens);
    case "TRUE":    tokens.next(); return true;
    case "FALSE":   tokens.next(); return false;
    case "NULL":    tokens.next(); return null;
    default:
      throw new SyntaxError(
        \`Unexpected token \${t.type} at line \${t.line}, column \${t.col}\`
      );
  }
}

function parseObject(tokens) {
  tokens.expect("LBRACE");
  const obj = {};
  if (tokens.peek().type === "RBRACE") { tokens.next(); return obj; }
  while (true) {
    const keyTok = tokens.expect("STRING");
    tokens.expect("COLON");
    obj[keyTok.value] = parseValue(tokens); // <-- recursion happens here
    const sep = tokens.next();
    if (sep.type === "RBRACE") return obj;
    if (sep.type !== "COMMA") {
      throw new SyntaxError(
        \`Unexpected token \${sep.type} at line \${sep.line}, column \${sep.col}\`
      );
    }
    // loop again: a comma must be followed by another member, never '}'
  }
}

function parseArray(tokens) {
  tokens.expect("LBRACKET");
  const arr = [];
  if (tokens.peek().type === "RBRACKET") { tokens.next(); return arr; }
  while (true) {
    arr.push(parseValue(tokens)); // <-- recursion happens here too
    const sep = tokens.next();
    if (sep.type === "RBRACKET") return arr;
    if (sep.type !== "COMMA") {
      throw new SyntaxError(
        \`Unexpected token \${sep.type} at line \${sep.line}, column \${sep.col}\`
      );
    }
  }
}`}</code>
      </pre>
      <p>
        The load-bearing detail is the pair of recursive calls marked above: <code>parseObject</code> calls{" "}
        <code>parseValue</code> to read each member's value, and <code>parseValue</code> calls{" "}
        <code>parseObject</code> or <code>parseArray</code> right back when it sees <code>{"{"}</code> or{" "}
        <code>[</code>. There's no separate code path for "an object nested three levels deep" — it's the same
        four functions calling each other, with the JavaScript call stack itself tracking how deep the nesting
        goes. (This is also why extremely deeply nested JSON — tens of thousands of levels — can blow the
        stack in a naive recursive-descent implementation; some hardened parsers use an explicit stack instead
        of native recursion specifically to avoid that.)
      </p>

      <h2>Walking the descent through a real example</h2>
      <p>
        Take <code>{`{"a":[1,2,{"b":3}]}`}</code> and trace what actually happens, call by call:
      </p>
      <ol>
        <li>
          <code>parseValue</code> peeks <code>LBRACE</code> and dispatches to <code>parseObject</code>.
        </li>
        <li>
          <code>parseObject</code> consumes <code>{"{"}</code>, reads key <code>"a"</code>, consumes{" "}
          <code>:</code>, then calls <code>parseValue</code> for the value — one stack frame deep.
        </li>
        <li>
          That call peeks <code>LBRACKET</code> and dispatches to <code>parseArray</code> — two frames deep.
        </li>
        <li>
          <code>parseArray</code> consumes <code>[</code> and loops: <code>parseValue</code> for element 0
          sees NUMBER and returns <code>1</code> directly (no further recursion — numbers are a leaf
          production); it consumes <code>,</code>, loops, and does the same for element 1, returning{" "}
          <code>2</code>.
        </li>
        <li>
          On the third iteration <code>parseArray</code> calls <code>parseValue</code> again, which this time
          peeks <code>LBRACE</code> and opens a brand-new <code>parseObject</code> call — three frames deep
          now (outer object → array → inner object). That call reads key <code>"b"</code>, calls{" "}
          <code>parseValue</code> for its value (NUMBER <code>3</code>, a leaf), consumes the closing{" "}
          <code>{"}"}</code>, and returns <code>{`{ b: 3 }`}</code> up to the array.
        </li>
        <li>
          <code>parseArray</code> consumes the next token, <code>]</code>, and returns{" "}
          <code>{`[1, 2, { b: 3 }]`}</code> up to the outer <code>parseValue</code> from step 3.
        </li>
        <li>
          The outermost <code>parseObject</code> now has that array as the value for <code>"a"</code>,
          consumes the final <code>{"}"}</code>, and returns the finished object.
        </li>
      </ol>
      <p>
        Every closing bracket corresponds to exactly one recursive call returning back up the stack — the
        nesting in the text and the nesting of function calls are the same shape.
      </p>

      <h2>Why specific "invalid JSON" mistakes fail — and where</h2>
      <p>
        These aren't stylistic complaints; each one is a concrete grammar violation caught at a specific
        stage.
      </p>
      <h3>Unquoted keys and single-quoted strings</h3>
      <p>
        Both fail inside the <em>tokenizer</em>, before the parser is even involved. The STRING token
        production in RFC 8259 is explicit: a string is a sequence of Unicode characters wrapped in{" "}
        <code>"</code> (U+0022), full stop — there is no alternate production for a bare identifier or for{" "}
        <code>'</code>-delimited text. When the tokenizer encounters a bare letter like <code>n</code> in{" "}
        <code>{`{name:`}</code>, no token rule matches it — not STRING, not a brace, not the start of{" "}
        <code>null</code> — so it fails immediately as an unrecognized character, without ever producing a
        token for the parser to reject. The mistake is caught at the lexical level, not the structural one.
      </p>
      <h3>Trailing commas</h3>
      <p>
        This one fails inside the <em>parser</em>, one level up. Look again at the loop in{" "}
        <code>parseObject</code>: after consuming a member's value, the parser reads the next token and
        branches — <code>{"}"}</code> means the object is done; <code>,</code> means loop back expecting{" "}
        <em>another member</em>, so the next thing it demands is a STRING key, not a closing brace. Given{" "}
        <code>{`{"a":1,}`}</code>, the comma is consumed, the loop repeats, and{" "}
        <code>tokens.expect("STRING")</code> is called — but the next token is <code>RBRACE</code>. That's the
        exact failure point: the comma was accepted as valid, and the state machine then found nothing
        satisfying what it demanded next. It isn't "sloppy-intolerance" — the grammar for a JSON object is
        literally <code>{`member (',' member)*`}</code>, a comma is a separator between two members, never a
        trailing terminator, so <code>{`,}`}</code> has no production that accounts for it.
      </p>
      <h3>Comments</h3>
      <p>
        Same failure mode as unquoted keys: <code>/</code> doesn't begin any JSON token, so the tokenizer
        rejects it on sight.
      </p>

      <h2>How "line X, column Y" gets computed</h2>
      <p>
        This requires the tokenizer to do a small amount of bookkeeping as it scans, independent of tokenizing
        itself: it keeps a running line counter (starting at 1, incremented every time it consumes a{" "}
        <code>\n</code>) and a running column counter (incremented per character consumed, reset to 1 right
        after each newline). Every time the tokenizer emits a token, it stamps that token with the (line,
        column) of its <em>first</em> character. When the parser later rejects a token — say, it got{" "}
        <code>RBRACE</code> where it expected <code>STRING</code> — it doesn't need to re-scan anything; it
        just reads the position already stamped on that token object and interpolates it into the thrown{" "}
        <code>SyntaxError</code> message. The position you see in an error is always the position of the token
        the parser choked on, not the position of whatever came before it — which is why the reported column
        sometimes looks one character later than where you'd instinctively look for the "actual" mistake (a
        missing comma is reported at the token after where the comma should have been, because that's the
        token that broke the expectation).
      </p>

      <h2>Strict failure vs. lenient recovery</h2>
      <p>
        <code>JSON.parse</code> and most standard-library JSON parsers are strict: the grammar defines no
        error-recovery production, so the first violation throws and the entire parse aborts. There is no
        partial result — you get an exception or a fully valid value, never something in between. This is
        deliberate (RFC 8259 defines no syntax for recovering from errors), and it's what makes JSON safe to
        trust: if <code>JSON.parse</code> doesn't throw, the interpretation is unambiguous.
      </p>
      <p>
        Lenient tools that "fix" pasted JSON (auto-correcting a trailing comma, upgrading single quotes,
        quoting a bare key) aren't running a more forgiving version of the same parser — they layer something
        in front of or instead of it: either a pattern-based pre-pass that rewrites known near-miss text into
        valid JSON before handing it to a real strict parser, or a hand-rolled parser with explicit recovery
        rules — e.g., when the "expect STRING, got RBRACE" state from the trailing-comma example is hit,
        silently treat the dangling comma as if it were never there and record a diagnostic instead of
        throwing. Either way, recovery is bolted on beyond the JSON grammar, which is why such tools converge
        on documenting their own dialect (often close to JSON5) rather than claiming to still parse "JSON."
      </p>

      <h2>A detail worth knowing: the reviver argument</h2>
      <p>
        <code>JSON.parse(text, reviver)</code> takes a second argument most code never uses. After parsing
        completes and the full value tree already exists, the reviver runs once per key, walking the tree
        bottom-up — deepest nested values first, then their parents, ending with the root value under the
        empty-string key. Each call gets <code>(key, value)</code> and whatever it returns replaces that entry
        (returning <code>undefined</code> deletes the key); a common use is reviving ISO date strings into{" "}
        <code>Date</code> objects. Structurally, it runs strictly <em>after</em> tokenizing and parsing are
        both done — it operates on an already-valid tree and has no way to influence or rescue a syntax error.
      </p>

      <h2>Try it</h2>
      <p>
        The tokenizer/parser split, the recursive descent, and the exact error positions described above are
        all things you can watch happen by feeding malformed input into a real implementation. The{" "}
        <Link to="/workspace/json-formatter">DevBox JSON Formatter</Link> runs a strict parse in your browser
        and surfaces the same line/column-tagged error a hand-rolled recursive-descent parser would produce, so
        you can pair the mental model above with the actual failure point on your own data.
      </p>
    </GuideLayout>
  );
}
