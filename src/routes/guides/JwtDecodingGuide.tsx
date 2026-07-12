import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "Is decoding a JWT the same as verifying it?",
    a: "No. Decoding just Base64URL-decodes the header and payload so you can read them — anyone can do this. Verifying checks the signature against a secret or public key to prove the token is authentic and unaltered. Only the server that holds the key can verify.",
  },
  {
    q: "Is the payload of a JWT encrypted?",
    a: "No. A standard JWT is signed, not encrypted. The payload is only Base64URL-encoded, so anyone who has the token can read its claims. Never put passwords or secrets in a JWT payload.",
  },
  {
    q: "What do exp and iat mean?",
    a: "They are standard claims expressed as Unix timestamps (seconds since 1970). iat is 'issued at' — when the token was created. exp is 'expiration' — after this time the token should be rejected.",
  },
  {
    q: "Why are there three parts separated by dots?",
    a: "A JWT is header.payload.signature. The header describes the signing algorithm, the payload holds the claims, and the signature is computed over the first two parts so tampering can be detected.",
  },
  {
    q: "Is it safe to paste a JWT into an online decoder?",
    a: "Use a decoder that runs entirely in your browser, like DevBox's, so the token is never sent to a server. Even then, avoid pasting production tokens that grant real access — decode test tokens during development.",
  },
];

export default function JwtDecodingGuide() {
  return (
    <GuideLayout
      title="Decoding and Understanding JWTs"
      description="What a JSON Web Token contains, how its three parts fit together, the difference between decoding and verifying, and the security rules that matter."
      canonicalPath="/guides/jwt-decoding"
      readingTime="7 min read"
      faqs={faqs}
      relatedTools={[
        { label: "JWT Decoder & Inspector", to: "/workspace/jwt-decoder" },
        { label: "Base64 Encoder / Decoder", to: "/workspace/base64-tool" },
      ]}
      relatedGuides={[
        { label: "Base64 encoding explained", to: "/guides/base64-encoding" },
        { label: "JSON formatting basics", to: "/guides/json-formatting" },
      ]}
    >
      <p>
        JSON Web Tokens (JWTs) are everywhere in modern authentication: log in to almost any web app and a JWT
        is probably riding along in your requests. They look like an opaque blob of characters, but they are
        surprisingly readable once you understand their structure. This guide explains what is inside a JWT,
        the crucial difference between decoding and verifying, and the security rules that keep you out of
        trouble.
      </p>

      <h2>The three parts</h2>
      <p>A JWT is three Base64URL-encoded sections joined by dots:</p>
      <pre>
        <code>{`eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiQWRhIn0.SflKxw...
└──── header ────┘ └──────── payload ────────┘ └ signature ┘`}</code>
      </pre>
      <ul>
        <li>
          <strong>Header</strong> — describes the token type and the signing algorithm, e.g.{" "}
          <code>{`{ "alg": "HS256", "typ": "JWT" }`}</code>.
        </li>
        <li>
          <strong>Payload</strong> — the claims: who the user is, what they can do, and when the token
          expires.
        </li>
        <li>
          <strong>Signature</strong> — a cryptographic hash of the header and payload, computed with a secret
          (HS256) or a private key (RS256). It proves the token has not been altered.
        </li>
      </ul>

      <h2>Decoding vs. verifying</h2>
      <p>This is the single most important distinction to understand:</p>
      <ul>
        <li>
          <strong>Decoding</strong> is just Base64URL-decoding the header and payload into readable JSON.
          Anyone holding the token can do it — no secret required. That is exactly what a JWT decoder does, and
          why you must never store sensitive data in the payload.
        </li>
        <li>
          <strong>Verifying</strong> recomputes the signature using the secret or public key and checks it
          against the token's signature. Only a party with the key can do this, and it is what actually proves
          the token is authentic. Verification always happens on the server.
        </li>
      </ul>
      <blockquote>
        A decoder tells you what a token <em>claims</em>. Only verification tells you whether to <em>believe</em>{" "}
        it.
      </blockquote>

      <h2>Reading the payload</h2>
      <p>A decoded payload might look like this:</p>
      <pre>
        <code>{`{
  "sub": "1234567890",
  "name": "Ada Lovelace",
  "role": "admin",
  "iat": 1735689600,
  "exp": 1735693200
}`}</code>
      </pre>
      <p>Several claim names are standardized:</p>
      <table>
        <thead>
          <tr>
            <th>Claim</th>
            <th>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>sub</code></td><td>Subject — who the token is about (usually a user ID).</td></tr>
          <tr><td><code>iss</code></td><td>Issuer — the service that created the token.</td></tr>
          <tr><td><code>aud</code></td><td>Audience — who the token is intended for.</td></tr>
          <tr><td><code>iat</code></td><td>Issued at — creation time as a Unix timestamp.</td></tr>
          <tr><td><code>exp</code></td><td>Expiration — the token is invalid after this time.</td></tr>
        </tbody>
      </table>
      <p>
        Everything else — <code>role</code>, <code>name</code>, <code>scope</code> — is a custom claim your
        application defines. Because timestamps are in seconds, an <code>exp</code> of{" "}
        <code>1735693200</code> is easy to check but not human-readable at a glance; a decoder that converts it
        to a date saves you the arithmetic.
      </p>

      <h2>Security rules that matter</h2>
      <ul>
        <li>
          <strong>Never trust an unverified token.</strong> On the server, always verify the signature before
          reading any claim.
        </li>
        <li>
          <strong>Never put secrets in the payload.</strong> It is readable by anyone with the token.
        </li>
        <li>
          <strong>Reject the <code>none</code> algorithm.</strong> A token whose header says{" "}
          <code>"alg": "none"</code> has no signature; a correctly configured server refuses it.
        </li>
        <li>
          <strong>Check expiration.</strong> Verification libraries reject expired tokens automatically, but
          only if you actually call them.
        </li>
        <li>
          <strong>Keep tokens short-lived.</strong> Pair a short-lived access token with a longer-lived
          refresh token so a leaked token has a small blast radius.
        </li>
      </ul>

      <h2>A debugging workflow</h2>
      <ol>
        <li>Decode the token to read its header and payload.</li>
        <li>Confirm the algorithm in the header is what you expect (and not <code>none</code>).</li>
        <li>Check <code>exp</code> against the current time to see whether the token is still valid.</li>
        <li>Confirm the custom claims (role, scope) match what your app requires.</li>
        <li>If authentication still fails, the problem is usually signature verification on the server, not the token contents.</li>
      </ol>

      <h2>Try it</h2>
      <p>
        The <Link to="/workspace/jwt-decoder">DevBox JWT Decoder</Link> splits a token into its header,
        payload, and signature and pretty-prints the claims — all in your browser, so the token never leaves
        your machine. Since each part is Base64URL-encoded, the{" "}
        <Link to="/guides/base64-encoding">Base64 guide</Link> is a useful companion.
      </p>
    </GuideLayout>
  );
}
