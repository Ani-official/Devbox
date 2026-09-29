import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "What exactly is the Norway problem?",
    a: "In YAML 1.1's core schema, the unquoted scalar NO (also No, no, OFF, Off, off, and their yes/on counterparts) matches the boolean regex and resolves to the boolean false. A country-code list containing Norway's ISO 3166-1 alpha-2 code NO, written unquoted, silently becomes false instead of the string \"NO\". It's named after this specific, repeatedly-reported bug in real config and data files.",
  },
  {
    q: "Did YAML 1.2 fix the Norway problem?",
    a: "Yes, in the sense that the YAML 1.2 core schema (published 2009) narrowed the boolean set to just true and false, so NO/No/no are no longer implicitly typed as anything but the string \"NO\". But YAML 1.2 fixing the spec didn't retroactively fix every parser — plenty of widely-used libraries still implement 1.1-style resolution by default.",
  },
  {
    q: "Is PyYAML still affected by this today?",
    a: "PyYAML's yaml.load and yaml.safe_load use resolvers carried over from YAML 1.1, so yes/no/on/off/true/false in various cases are still resolved as booleans, and it still exhibits the Norway problem. Libraries that explicitly implement YAML 1.2, such as ruamel.yaml in its default mode, use the narrower boolean set instead. Which one you get depends entirely on which library and which loader you picked.",
  },
  {
    q: "Why does 0755 parse differently in different YAML tools?",
    a: "YAML 1.1's core schema treats a leading zero on a plain integer as octal, so 0755 can resolve to octal 755, which is decimal 493. YAML 1.2's core schema has no bare-leading-zero octal rule — 0755 resolves as the plain decimal integer 755, and 0o755 is the explicit octal form. Same six characters, two different numbers, depending on which schema your parser follows.",
  },
  {
    q: "Does quoting a value always prevent these problems?",
    a: "Yes. YAML's grammar treats any scalar wrapped in single or double quotes as a string unconditionally, regardless of what it looks like. A quoted \"NO\", \"1.20\", or \"0755\" is always the string you typed, never a boolean, float, or octal integer. Quoting is the one fix that works the same way across every conforming YAML parser and every schema version.",
  },
  {
    q: "Does JSON have an equivalent implicit-typing bug?",
    a: "No. JSON's grammar has no implicit type inference: a string is always delimited by double quotes and is always a string, and the only two boolean literals are the lowercase, case-sensitive true and false with no yes/no/on/off aliases. That rigidity is exactly why JSON, despite being more tedious to hand-write, is immune to this entire bug class.",
  },
];

export default function YamlTradeoffsGuide() {
  return (
    <GuideLayout
      title="YAML's Hidden Traps: The Norway Problem and Other Type-Inference Gotchas"
      description="How YAML 1.1's implicit boolean, integer, and null rules turn unquoted scalars like NO and 0755 into the wrong type, and why quoting is the only reliable fix."
      canonicalPath="/guides/yaml-design-tradeoffs"
      readingTime="9 min read"
      faqs={faqs}
      relatedTools={[
        { label: "JSON ⇄ YAML Converter", to: "/workspace/json-yaml-converter" },
      ]}
      relatedGuides={[
        { label: "JSON vs YAML: When to Use Each", to: "/guides/json-yaml" },
      ]}
    >
      <p>
        YAML looks like JSON with better manners: same maps-lists-scalars data model, less punctuation. What
        that resemblance hides is that every unquoted scalar in a YAML document passes through an implicit
        typing step before it reaches your program, and that step has a documented history of turning the
        value you wrote into a value you didn't mean. The canonical case is a two-letter country code that
        turns into a boolean. It has a name — the Norway problem — because it has bitten enough real
        pipelines, in enough public bug reports, that the YAML community had to give it one.
      </p>

      <h2>What actually happens to NO</h2>
      <p>
        Say you're generating a YAML file listing ISO 3166-1 alpha-2 country codes, and Norway's code, NO,
        ends up unquoted in the list alongside SE, DK, and FI. Under a parser implementing the YAML 1.1 core
        schema — which is what PyYAML's <code>yaml.load</code> and <code>yaml.safe_load</code> use by
        default, along with a number of libyaml-based tools — that bare <code>NO</code> is not read as a
        two-character string. It's read as the boolean <code>false</code>. Your list of strings quietly
        becomes a list containing a boolean, and depending on how downstream code handles it, you get anything
        from a wrong lookup to a silent skip to a crash three functions away from where the data was loaded.
      </p>
      <p>
        This isn't a parser bug in the sense of an implementation mistake. It's the schema working exactly as
        specified. YAML 1.1's core schema resolves any plain scalar matching a specific boolean pattern into a
        boolean type, and that pattern is broader than most people expect.
      </p>

      <h2>The exact rule: YAML 1.1's boolean regex</h2>
      <p>
        The YAML 1.1 specification's bool type (<code>tag:yaml.org,2002:bool</code>) resolves any of the
        following case variants as booleans: <code>y</code>, <code>Y</code>, <code>yes</code>, <code>Yes</code>
        , <code>YES</code>, <code>n</code>, <code>N</code>, <code>no</code>, <code>No</code>, <code>NO</code>,{" "}
        <code>true</code>, <code>True</code>, <code>TRUE</code>, <code>false</code>, <code>False</code>,{" "}
        <code>FALSE</code>, <code>on</code>, <code>On</code>, <code>ON</code>, <code>off</code>, <code>Off</code>
        , <code>OFF</code>. That's the strict spec. In practice, PyYAML's actual resolver is slightly narrower —
        its bool regex covers yes/no/true/false/on/off in their case variants but drops the bare single-letter{" "}
        <code>y</code>/<code>n</code> forms — but the country-code-relevant tokens, <code>no</code>,{" "}
        <code>No</code>, and <code>NO</code>, are very much still in there. That's the whole bug: a
        boolean-detection regex that was written to make config files convenient (so you can type{" "}
        <code>enabled: yes</code> instead of <code>enabled: true</code>) also happens to match a real ISO
        country code, a real day-of-week abbreviation, and a handful of other short strings people put in
        config files unquoted.
      </p>

      <h2>YAML 1.2 narrowed it — the spec fix landed in 2009</h2>
      <p>
        The YAML 1.2 specification, published in 2009, replaced the 1.1 core schema's type-resolution rules
        specifically to close this class of bug. Under YAML 1.2's core schema, the only implicit booleans are{" "}
        <code>true</code> and <code>false</code> (plus, in some implementations, their initial-capital and
        all-caps forms) — <code>yes</code>, <code>no</code>, <code>on</code>, and <code>off</code> are no
        longer special. A bare <code>NO</code> in a YAML 1.2 document is just the string <code>"NO"</code>.
      </p>
      <p>
        The catch is that a spec revision doesn't automatically update the parsers already deployed everywhere.
        As of this writing, PyYAML's default loaders are still YAML 1.1 in their type-resolution behavior — the
        Norway problem is fully reproducible today with <code>yaml.safe_load</code>. Libraries built explicitly
        around the newer spec, like ruamel.yaml in its default round-trip mode, follow YAML 1.2 rules instead.
        The practical consequence: whether your unquoted <code>NO</code> survives as a string or gets rewritten
        to <code>false</code> depends on which library, and sometimes which loader class within that library,
        parsed the file. You cannot tell just by looking at the YAML.
      </p>

      <h2>The rest of the implicit-typing minefield</h2>
      <p>
        Booleans get the famous name, but the same root cause — plain scalars being pattern-matched into
        non-string types before you get a say — shows up in at least three other places:
      </p>
      <ul>
        <li>
          <strong>Version strings read as floats.</strong> <code>version: 1.20</code> unquoted matches the
          float pattern, so it resolves to the number <code>1.2</code>. The trailing zero, which matters if
          you're comparing version strings, is gone. The same thing happens to any dotted numeric identifier
          that isn't meant to be arithmetic.
        </li>
        <li>
          <strong>Nulls appearing where you meant "empty string" or "not set yet".</strong> An unquoted{" "}
          <code>null</code>, <code>Null</code>, <code>NULL</code>, a bare <code>~</code>, or simply leaving a
          value blank after the colon all resolve to YAML's null type. If your code distinguishes between "no
          value" and "empty string," an unquoted blank will collapse that distinction for you.
        </li>
        <li>
          <strong>Octal-looking permission strings.</strong> A Unix mode like <code>0755</code>, written
          unquoted the way it appears in a <code>chmod</code> command, is ambiguous across schema versions.
          YAML 1.1's core schema treats a leading zero on a plain integer as an octal marker, so{" "}
          <code>0755</code> resolves to octal 755 — decimal 493. YAML 1.2's core schema has no such rule for a
          bare leading zero; there, <code>0755</code> is simply the decimal integer 755, and the unambiguous
          way to write octal is the explicit <code>0o755</code> form. This exact ambiguity has shown up in
          Ansible playbooks and CI configs where a file-mode field was written the "obvious" Unix way and came
          out as the wrong number depending on the YAML engine underneath the tool.
        </li>
      </ul>

      <h2>Annotated example</h2>
      <p>
        Here's a config that packs in the Norway problem and the octal ambiguity together, with what each line
        actually parses as under a YAML 1.1 style resolver:
      </p>
      <pre>
        <code>{`# What the author meant vs. what a YAML 1.1 resolver produces
country_code: NO        # parses as boolean false, not the string "NO"
build_status: off       # parses as boolean false, not the string "off"
app_version: 1.20       # parses as float 1.2, the trailing zero is gone
config_dir: ~           # parses as null, not the string "~"
file_mode: 0755         # parses as octal 755 -> decimal 493, not decimal 755

# The fix: quote every scalar that could be misread
country_code: "NO"      # always the string "NO"
build_status: "off"     # always the string "off"
app_version: "1.20"     # always the string "1.20"
config_dir: "~"         # always the string "~"
file_mode: "0755"       # always the string "0755" - parse it yourself, deliberately`}</code>
      </pre>

      <h2>The fix, and why it's not a workaround</h2>
      <p>
        Quoting isn't a hack that happens to suppress the bug — it's the mechanism the YAML grammar defines
        for saying "treat this as a string, full stop." A scalar wrapped in single or double quotes is a
        string node regardless of what characters are inside it, under every YAML schema version, in every
        conforming parser. That's a stronger guarantee than "this library's resolver probably won't match my
        value." If a field can ever legitimately hold a country code, a version string, a permission mode, a
        day abbreviation, or a yes/no-shaped identifier, quote it at the point you write it, and treat any
        unquoted scalar in a file you're reviewing as a type to double-check rather than assume.
      </p>

      <h2>Why JSON doesn't have this bug class at all</h2>
      <p>
        This is the part that makes YAML's convenience a genuine tradeoff rather than a strict upgrade over
        JSON. JSON's grammar has no implicit type coercion, full stop. A JSON string is always delimited by{" "}
        <code>"..."</code> — there's no bare-word string in JSON at all, so there's no bare word for a
        type-inference pass to misclassify. A JSON boolean is always exactly the lowercase, case-sensitive
        tokens <code>true</code> or <code>false</code> — there is no <code>yes</code>, no <code>on</code>, no{" "}
        <code>Off</code>, no capitalization variant. JSON numbers follow one unambiguous grammar with no octal
        special case for a leading zero (a JSON number can't even start with a leading zero followed by more
        digits). None of this is an accident of JSON being newer or simpler for its own sake — it's the direct
        consequence of JSON refusing to let a value's type depend on pattern-matching its literal text. YAML
        buys you comments, bare words, and multi-line strings; it pays for them with an entire bug class that
        JSON structurally cannot have.
      </p>

      <h2>Try it</h2>
      <p>
        If you're moving data between the two formats and want to see exactly how a value gets typed on each
        side, run it through the{" "}
        <Link to="/workspace/json-yaml-converter">DevBox JSON ⇄ YAML Converter</Link> and check the output
        types before you trust them — especially anything that looks like a country code, a version number, or
        a permission string. For the broader syntax and conversion picture, see{" "}
        <Link to="/guides/json-yaml">JSON vs YAML: When to Use Each</Link>.
      </p>
    </GuideLayout>
  );
}
