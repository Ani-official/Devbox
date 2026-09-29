import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "Is JavaScript's regex engine vulnerable to ReDoS?",
    a: "Yes. V8 (Chrome, Node.js) uses a backtracking engine, same as PCRE, Python's re, Java's Pattern, and .NET's Regex. Any of them can be pushed into exponential runtime by a pattern with nested or overlapping quantifiers, regardless of the host language.",
  },
  {
    q: "Does wrapping a group as non-capturing (?:...) fix catastrophic backtracking?",
    a: "No. Capturing vs. non-capturing only changes whether the engine records what a group matched for later retrieval. It does not reduce the number of ways the engine can partition the input across that group, which is what drives the blowup. You have to remove the structural ambiguity itself.",
  },
  {
    q: "How do I find catastrophic patterns before they reach production?",
    a: "Static checkers like safe-regex, recheck, and rxxr specifically look for nested or overlapping quantifiers and ambiguous alternations. Pair that with a hard match timeout at runtime as a backstop, since new catastrophic patterns get written faster than checkers get updated.",
  },
  {
    q: "Why doesn't RE2 (or Rust's regex crate) support backreferences?",
    a: "A backreference like (\\w+)\\1 requires the engine to remember the literal substring an earlier group matched and compare it against later input. A finite automaton only tracks which states are reachable, not which specific text produced them, so backreferences fall outside what a pure automaton can express — supporting them would require falling back to backtracking, which is exactly what these engines are built to avoid.",
  },
  {
    q: "If backtracking is this risky, why do most languages still ship it by default?",
    a: "Backtracking engines support backreferences, lookahead, and lookbehind, which cover a lot of real validation logic that a pure automaton can't express. That expressiveness was worth the tradeoff long before ReDoS was a named, well-understood attack class. Newer engines like RE2 and Rust's regex trade some expressiveness for a runtime guarantee.",
  },
  {
    q: "Does adding a match timeout fully solve ReDoS?",
    a: "It bounds the damage but not the cost — the thread still burns CPU until the timeout fires, and on a single-threaded runtime that CPU time is unavailable to everything else in the meantime. Fix the pattern first; treat the timeout as a safety net, not the fix.",
  },
];

export default function RegexEnginesGuide() {
  return (
    <GuideLayout
      title="Regex Engines Explained: Backtracking, NFAs, and Catastrophic Complexity"
      description="How backtracking regex engines actually execute a pattern, why nested quantifiers cause exponential blowup, and what linear-time engines like RE2 do instead."
      canonicalPath="/guides/regex-engine-internals"
      readingTime="10 min read"
      faqs={faqs}
      relatedTools={[{ label: "Regex Tester", to: "/workspace/regex-tester" }]}
      relatedGuides={[{ label: "Regex Testing: Flags, Groups, and Debugging", to: "/guides/regex-testing" }]}
    >
      <p>
        Most people learn regex as syntax: character classes, quantifiers, groups. That gets you a pattern
        that matches what you expect on the input you tested. It does not tell you what happens on input you
        did not test — specifically, input designed to make the pattern take a very long time. That failure
        mode has a name, ReDoS, and understanding it requires knowing what the engine is actually doing
        underneath the syntax. This guide covers that mechanism: how a backtracking match attempt proceeds
        step by step, why certain pattern shapes cause it to explode, and how a different class of engine
        avoids the problem entirely by giving up a few features.
      </p>

      <h2>Two families of regex engines</h2>
      <p>
        Almost every regex engine you have used day to day — JavaScript's built-in engine, Python's{" "}
        <code>re</code>, PCRE (used by PHP and many C/C++ tools), Java's <code>Pattern</code>, .NET's{" "}
        <code>Regex</code> — is a <strong>backtracking NFA simulator</strong>. It compiles your pattern into a
        nondeterministic finite automaton (NFA), then walks a single path through it, guessing at every
        choice point (every quantifier, every alternation) and undoing that guess if a later part of the
        pattern fails. This is simple to implement and lets the syntax grow: backreferences, lookahead,
        lookbehind, atomic groups all bolt on naturally because the engine is already doing exploratory,
        undoable work.
      </p>
      <p>
        A smaller family — RE2, Rust's <code>regex</code> crate, Go's <code>regexp</code> — compiles the
        pattern into a genuine finite automaton and simulates <em>every</em> reachable state at once per input
        character, using an algorithm that traces back to Thompson's construction. There is no guessing and
        nothing to undo, so runtime is bounded at O(pattern size × input length) no matter what the input
        looks like. The cost is that these engines cannot express backreferences or true lookaround, because
        both require remembering specific matched text along one path, not just which states are live.
      </p>

      <h2>What backtracking actually does</h2>
      <p>
        Take <code>{"a*a*b"}</code> against the input <code>{"aaaa"}</code> — four a's, no trailing b. This is
        the standard minimal example for showing backtracking mechanics, because both quantifiers are
        greedy and the failure is at the very end of the string, forcing the engine to exhaust every way of
        dividing the a's between the two groups before it can give up.
      </p>
      <p>
        The first <code>{"a*"}</code> is greedy, so it grabs all four a's immediately. The second{" "}
        <code>{"a*"}</code> then tries to grab what's left — nothing — and the engine looks for{" "}
        <code>b</code> at position 4. There is no character there; the string ended. That's a failure, but
        not the failure: the engine has a choice point recorded at the first <code>{"a*"}</code>, so it
        backtracks, gives back one of the four a's, and tries again with the second <code>{"a*"}</code> now
        allowed to claim it. That still doesn't produce a <code>b</code>, so it backtracks again. This repeats
        until every combination of (first group's count, second group's count) that sums to 4 has been tried:
      </p>
      <pre>
        <code>{`Pattern: a*a*b
Input:   aaaa   (4 a's, no trailing b)

first a* takes 4, second a* takes 0 -> check 'b' at index 4 -> end of string, fail
first a* takes 3, second a* takes 1 -> check 'b' at index 4 -> fail
first a* takes 3, second a* takes 0 -> check 'b' at index 3 -> 'a', fail
first a* takes 2, second a* takes 2 -> check 'b' at index 4 -> fail
first a* takes 2, second a* takes 1 -> check 'b' at index 3 -> fail
first a* takes 2, second a* takes 0 -> check 'b' at index 2 -> fail
first a* takes 1, second a* takes 3 -> check 'b' at index 4 -> fail
first a* takes 1, second a* takes 2 -> check 'b' at index 3 -> fail
first a* takes 1, second a* takes 1 -> check 'b' at index 2 -> fail
first a* takes 1, second a* takes 0 -> check 'b' at index 1 -> fail
first a* takes 0, second a* takes 4 -> check 'b' at index 4 -> fail
first a* takes 0, second a* takes 3 -> check 'b' at index 3 -> fail
first a* takes 0, second a* takes 2 -> check 'b' at index 2 -> fail
first a* takes 0, second a* takes 1 -> check 'b' at index 1 -> fail
first a* takes 0, second a* takes 0 -> check 'b' at index 0 -> fail

15 attempts total, then the engine reports no match.`}</code>
      </pre>
      <p>
        Fifteen attempts for four characters follows (n+1)(n+2)/2 — quadratic in the length of the run, not
        linear. Two independent <code>{"a*"}</code> groups over the same characters means every split point
        between them is a distinct path the engine has no way to rule out in advance, because nothing in the
        pattern says the split has to happen anywhere in particular. Nobody hangs a server with this exact
        pattern; it's slow-growing enough to stay academic. It's the shape that matters, because nesting that
        same ambiguity is what turns quadratic into exponential.
      </p>

      <h2>Catastrophic backtracking: when it's exponential, not quadratic</h2>
      <p>
        Nest a quantifier inside another quantifier — <code>{"(a+)+b"}</code> — or write an alternation where
        both branches can match the same text — <code>{"(a|a)+b"}</code> — and the number of ways to
        partition a run of characters among the repetitions stops growing quadratically and starts growing
        exponentially. In <code>{"(a+)+b"}</code>, the inner <code>{"a+"}</code> can claim any nonempty
        chunk of the run, and the outer <code>+</code> can repeat that any number of times, so for a run of{" "}
        <code>n</code> a's there are roughly 2^(n-1) distinct ways to chop it into pieces — every one of them
        gets tried before the engine admits there's no <code>b</code>.
      </p>
      <p>
        That exponent is why 20-30 characters is the well-known threshold for hanging a process on this bug
        class: 2^24 is about 16 million backtracking attempts, 2^29 is over 500 million, each with real
        per-step engine overhead. A string of "a" repeated 30 times with no trailing <code>b</code>, run
        against <code>{"(a+)+b"}</code> or an equivalently-shaped pattern, will peg a CPU core for as long as
        you let it — seconds, minutes, or until something kills the process. This is <strong>catastrophic
        backtracking</strong>, and it's the mechanism behind the ReDoS (Regular Expression Denial of Service)
        entries you'll find filed against countless npm and PyPI packages.
      </p>
      <p>
        This is not a toy concern. Cloudflare's global outage in July 2019 traced back to exactly this
        failure mode: a WAF rule with a pattern shaped this way hit pathological input in production traffic
        and drove CPU to 100% across their edge fleet. On a single-threaded runtime like Node.js, the effect
        is worse than "one slow request" — the event loop is blocked, so every other request queued behind
        it stalls too. If any part of a validation, sanitization, or routing regex takes attacker-controlled
        input and has nested or overlapping quantifiers, you have a live ReDoS bug, not a hypothetical one.
      </p>

      <h2>The fix: remove the ambiguity, not the feature</h2>
      <p>
        The nested group in <code>{"(a+)+b"}</code> isn't adding any matching power over a flat quantifier —
        it matches exactly the same language as a single, non-nested <code>{"a+"}</code>. The fix is
        recognizing when a nested or overlapping quantifier is redundant and collapsing it:
      </p>
      <pre>
        <code>{`Vulnerable (exponential ambiguity):
  ^(a+)+b$
  ^(a|a)+b$

Rewritten (same matched language, single quantifier, no ambiguity):
  ^a+b$`}</code>
      </pre>
      <p>
        Real-world cases are rarely this obviously equivalent, but the diagnostic is the same: look for a
        quantified group that contains another quantifier, or an alternation whose branches can both consume
        the same characters, and ask whether the pattern actually needs two independent ways to reach the
        same split. If you need atomic grouping to keep a legitimately necessary nested structure from
        backtracking, PCRE's <code>{"(?>...)"}</code> and possessive quantifiers like <code>{"a++"}</code>{" "}
        tell the engine to commit to a match and never reconsider it — trading a small amount of matching
        flexibility for a hard cap on backtracking.
      </p>

      <h2>Lookahead: zero-width, but not free</h2>
      <p>
        Positive lookahead <code>{"(?=...)"}</code> and negative lookahead <code>{"(?!...)"}</code> are
        assertions: the engine checks whether the sub-pattern inside would match starting at the current
        position, then discards that match and does not advance the position at all. That's what "zero-width"
        means — it changes nothing about what's consumed, only whether matching is allowed to continue.
        Password validation patterns lean on this heavily, stacking several lookaheads at the start of the
        pattern to require a digit, an uppercase letter, and a symbol without caring where each one appears.
      </p>
      <p>
        They still cost backtracking, because checking a lookahead means running its sub-pattern as its own
        match attempt, with its own choice points. A lookahead whose inner pattern contains a nested
        quantifier is exactly as capable of exponential blowup as if that sub-pattern were matched inline —
        the zero-width assertion doesn't isolate the engine from the cost, it just discards the match once
        the (potentially expensive) check finishes.
      </p>

      <h2>Try it</h2>
      <p>
        The <Link to="/workspace/regex-tester">DevBox Regex Tester</Link> is useful for confirming what a
        pattern matches, but it won't show you backtracking cost directly — for that, watch what happens to
        match time as you extend a run of repeated characters against a suspect pattern with no valid ending.
        If the time to fail grows faster than the input does, you've found a catastrophic pattern before your
        users' input did.
      </p>
    </GuideLayout>
  );
}
