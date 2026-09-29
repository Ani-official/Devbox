import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "Is alg:none still a real risk in 2026?",
    a: "Modern mainstream libraries (jsonwebtoken, jose, PyJWT, jjwt) reject 'none' by default and require you to opt in explicitly. The risk today is mostly in hand-rolled verifiers, older library versions still pinned in dependency trees, and internal microservices that parse JWTs 'quickly' without pulling in a vetted library.",
  },
  {
    q: "Can algorithm confusion happen with two RS256 services?",
    a: "No — the attack specifically swaps an asymmetric algorithm (RS256, whose public key is not secret) for a symmetric one (HS256, which expects a secret key) at the same key parameter. If both sides only ever use RS256 and the verifier ignores the header's alg entirely in favor of a fixed expected algorithm, the confusion has nothing to attach to.",
  },
  {
    q: "If I whitelist algorithms, do I still need to check exp and aud?",
    a: "Yes. Algorithm whitelisting only stops an attacker from choosing how the signature is checked. It says nothing about whether the token has expired, was issued for a different service, or is being used before its nbf time. Those are separate checks the verifier (or your code, if the library doesn't do it automatically) must run every time.",
  },
  {
    q: "Why does a client-side JWT decoder not verify the signature?",
    a: "Verification needs key material — an HMAC secret or an RS256 private key — that only the issuing server holds. A browser-side tool can never legitimately possess it, so a decoder is scoped to the part that requires no secret: splitting the token and rendering the header and payload JSON.",
  },
  {
    q: "Is putting a JWT in an HTTP-only cookie enough on its own?",
    a: "It closes the XSS-reads-localStorage hole, but you then need CSRF protection (SameSite cookies, a CSRF token, or both) since the browser will attach the cookie automatically. There's no single storage location that removes every class of attack; the point is matching the storage choice to the threat you're actually defending against.",
  },
  {
    q: "Does signature verification prove the payload is safe to trust blindly?",
    a: "It proves the payload wasn't altered after signing and that it was issued by whoever holds the signing key. It does not prove the claims are still meaningful — a validly signed token can still be expired, revoked, or intended for a different audience, which is why exp, nbf, iss, and aud checks are separate from signature verification.",
  },
];

export default function JwtSecurityGuide() {
  return (
    <GuideLayout
      title="JWT Security Deep Dive: Algorithm Confusion, alg:none, and Verification Pitfalls"
      description="How the alg:none and RS256-to-HS256 algorithm confusion attacks work, why they happen, and how to verify JWTs so neither one is possible."
      canonicalPath="/guides/jwt-security"
      readingTime="9 min read"
      faqs={faqs}
      relatedTools={[{ label: "JWT Decoder", to: "/workspace/jwt-decoder" }]}
      relatedGuides={[{ label: "Decoding and Understanding JWTs", to: "/guides/jwt-decoding" }]}
    >
      <p>
        A JWT's header names the algorithm used to sign it. That single design decision — letting the token
        describe how it should be checked — is the root of the two most consequential JWT vulnerability
        classes in the wild: the <code>alg:none</code> bypass and RS256-to-HS256 algorithm confusion. Both were
        real, exploitable bugs in production libraries, not academic curiosities, and both come from the same
        mistake: trusting the token to tell the verifier what to do. This guide covers how each attack works,
        why the spec allowed the conditions that made them possible, and what a correct verifier does instead.
      </p>

      <h2>The alg:none bypass</h2>
      <p>
        RFC 7518 defines <code>"none"</code> as a legitimate value for the JWT header's <code>alg</code> field.
        It exists for a narrow case: an "unsecured JWT," used when integrity is already guaranteed by some
        other layer — for example, a token passed over a channel that's already authenticated and encrypted, or
        used purely as an internal, tamper-proof-by-context data envelope. In that case the token has no
        signature at all: <code>header.payload.</code> with nothing after the final dot.
      </p>
      <p>
        The problem was implementation, not the spec's existence of the value. Early JWT libraries parsed the
        header, read whatever algorithm the token claimed to use, and dispatched to that algorithm's
        verification routine — including a no-op routine for <code>"none"</code> — without requiring the caller
        to explicitly opt into accepting unsecured tokens. That meant an attacker could take any legitimate
        token, decode the header, change <code>alg</code> to <code>"none"</code>, edit the payload however they
        wanted (set <code>role: "admin"</code>, change <code>sub</code> to another user's ID), re-encode the
        header and payload, and append an empty signature segment. A vulnerable verifier would see{" "}
        <code>alg: none</code>, skip signature checking entirely, and accept the forged token as valid — because
        the library treated "the token says don't verify me" as a valid instruction rather than as an attacker
        controlled input to be distrusted by default.
      </p>
      <pre>
        <code>{`// Attacker-forged token — no signature required
const header  = { alg: "none", typ: "JWT" };
const payload = { sub: "victim-or-admin", role: "admin", exp: 9999999999 };

const forged =
  base64url(JSON.stringify(header)) + "." +
  base64url(JSON.stringify(payload)) + ".";
  // trailing dot, empty signature segment — valid "none" JWT syntax`}</code>
      </pre>
      <p>
        This is why every credible JWT library today requires <code>alg: none</code> to be explicitly allowed by
        the caller, if it's supported at all, and why security guidance almost universally says "just reject
        <code> none</code>" rather than "verify it correctly" — there's nothing to verify, so the only safe
        behavior is refusal unless the deployment has a specific, deliberate reason to accept unsecured tokens.
      </p>

      <h2>Algorithm confusion: RS256 verified as HS256</h2>
      <p>
        The second attack is subtler and hit several major libraries around 2015-2016 (Auth0's <code>jsonwebtoken</code>{" "}
        for Node and others had documented advisories). It exploits a server that's configured for RS256 —
        an asymmetric scheme where the issuer signs with a private key and anyone can verify with the
        corresponding public key. Public keys are, deliberately, not secret. They're often published at a{" "}
        <code>/.well-known/jwks.json</code> endpoint or embedded directly in client code.
      </p>
      <p>
        The vulnerable pattern: the verifier function takes a single "key" parameter and a token, and derives
        which cryptographic operation to run from the token's own <code>alg</code> header — RS256 means
        "treat this key as an RSA public key," HS256 means "treat this key as an HMAC secret." If an attacker
        gets the server's RS256 public key (trivial, since it's public by design) and changes the token header
        to <code>alg: HS256</code>, they can then compute{" "}
        <code>HMAC-SHA256(header + "." + payload, publicKeyBytes)</code> themselves and attach it as the
        signature. If the verifier blindly follows the header's instruction, it takes that same public key,
        this time treating it as an HMAC secret, and runs the exact same HMAC computation the attacker just
        ran. The two values match. The forged token "verifies."
      </p>
      <p>
        The dangerous substitution is precisely this: a value that is safe to be asymmetric-public (an RSA
        public key, meant to be handed to anyone) gets reused as if it were symmetric-secret (an HMAC key,
        meant to be known only to the signer and verifier). The security property of "public keys can be
        published freely" only holds under RS256's threat model. Once that same byte string is fed into an
        HMAC function, the "public" property becomes the vulnerability — anyone who has the public key, which
        by definition is anyone, can produce a signature the verifier accepts.
      </p>

      <h2>The fix: never let the token choose its own verification method</h2>
      <p>
        Both attacks share a root cause: the verifier let attacker-controlled input (the token's own header)
        decide which code path and which key to use for verification. The fix in both cases is the same
        principle — the caller, not the token, declares the acceptable algorithm(s) up front, and the library
        checks the token's <code>alg</code> against that whitelist rather than obeying it.
      </p>
      <pre>
        <code>{`// VULNERABLE — algorithm is taken from the token itself
function verifyNaive(token, key) {
  const { header, payload, signature } = splitJwt(token);
  // dispatches on header.alg — attacker controls header.alg
  return cryptoVerify(header.alg, key, header, payload, signature);
}

// CORRECT — caller pins the algorithm; the header is not trusted
function verifySafe(token, publicKey) {
  const { header, payload, signature } = splitJwt(token);

  const ALLOWED_ALGS = ["RS256"]; // explicit whitelist, no "none", no HS256
  if (!ALLOWED_ALGS.includes(header.alg)) {
    throw new Error("Unacceptable algorithm: " + header.alg);
  }

  if (!cryptoVerify("RS256", publicKey, header, payload, signature)) {
    throw new Error("Bad signature");
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && now >= payload.exp) throw new Error("Token expired");
  if (payload.nbf && now < payload.nbf) throw new Error("Token not yet valid");
  if (payload.aud && payload.aud !== "my-api")  throw new Error("Wrong audience");
  if (payload.iss && payload.iss !== "my-issuer") throw new Error("Wrong issuer");

  return payload;
}`}</code>
      </pre>
      <p>
        In real libraries this looks like passing <code>algorithms: ["RS256"]</code> as an explicit option to{" "}
        <code>jwt.verify()</code> rather than omitting it — omitting it is exactly the historical footgun,
        since older defaults would accept whatever the header said.
      </p>

      <h2>Decoding is not verifying, and that's by design</h2>
      <p>
        A decoder reads the header and payload with two operations that require no secret at all: Base64URL
        decoding and <code>JSON.parse</code>. Both segments were never encrypted, only encoded, so anyone
        holding the token — including a browser-side tool — can read them in full. That's exactly what
        DevBox's JWT decoder does, and deliberately all it does: it has no server-side secret to check a
        signature with, and it shouldn't pretend to. A tool that showed a green "valid" checkmark based on
        nothing but successful JSON parsing would be actively misleading. Verification is a different
        operation entirely — it needs the HMAC secret or the RSA/EC key pair, requires running the actual
        signing algorithm against the first two segments, and comparing the result byte-for-byte against the
        third segment. That can only happen where the key lives, which for a client-side debugging tool is
        never.
      </p>

      <h2>A valid signature still isn't the end of validation</h2>
      <p>
        Signature verification answers exactly one question: was this exact header and payload signed by the
        holder of this key, unmodified? It says nothing about whether the token is still current or intended
        for this service. A correct verification step also checks:
      </p>
      <ul>
        <li>
          <code>exp</code> (expiration) — reject if the current time is at or past this Unix timestamp.
        </li>
        <li>
          <code>nbf</code> (not before) — reject if the current time is earlier than this timestamp; used for
          tokens that shouldn't be usable until some future point.
        </li>
        <li>
          <code>iss</code> (issuer) — reject if this doesn't match the issuer your service expects, which
          matters once you trust more than one signer or key.
        </li>
        <li>
          <code>aud</code> (audience) — reject if this doesn't name your service; otherwise a token minted for
          one API can be replayed against another that happens to trust the same signing key.
        </li>
      </ul>
      <p>
        Most mature libraries check <code>exp</code> and <code>nbf</code> automatically once you call the
        verify function, but <code>iss</code> and <code>aud</code> frequently require you to pass the expected
        values explicitly — skip that, and a perfectly validly signed token from an unrelated context will
        sail through.
      </p>

      <h2>A practical aside on where the token lives</h2>
      <p>
        None of the above matters if the token is trivial to steal client-side. A JWT stored in{" "}
        <code>localStorage</code> is readable by any JavaScript running on the page — your own code, a
        dependency, or an injected script from an XSS bug. There's no browser-level barrier between "your
        app's code" and "any script that executes in this page," so if an attacker gets script execution, they
        read <code>localStorage</code> and exfiltrate the token directly. An <code>httpOnly</code> cookie is
        invisible to <code>document.cookie</code> and to any JS API — the browser attaches it to requests but
        never exposes its value to script, which removes that specific exfiltration path (though it trades in
        a need for CSRF defenses, since the browser now sends the cookie automatically). This isn't a general
        security tip; it follows directly from the fact that a JWT is a bearer credential — whoever holds the
        string can use it, no additional proof required — so where that string can be read from is the whole
        game.
      </p>

      <h2>Try it</h2>
      <p>
        Use the <Link to="/workspace/jwt-decoder">DevBox JWT Decoder</Link> to inspect a token's header and
        confirm which algorithm it declares — useful for auditing whether your own services are still issuing
        or accepting anything other than the algorithm you intend. For the basics of what a JWT's three
        segments contain, see <Link to="/guides/jwt-decoding">Decoding and Understanding JWTs</Link>.
      </p>
    </GuideLayout>
  );
}
