import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "Why does curl -d send form-encoded data instead of JSON?",
    a: "curl's -d/--data flag has always meant application/x-www-form-urlencoded — that predates JSON being common. curl only sets Content-Type automatically when you don't. If you pass -d without an explicit -H \"Content-Type: application/json\", the server sees the right bytes but the wrong content type, and a strict JSON parser on the server will reject or misparse the body.",
  },
  {
    q: "Can a request have both Content-Length and Transfer-Encoding: chunked?",
    a: "No, and HTTP/1.1 (RFC 9112) explicitly forbids sending both on the same message unless Transfer-Encoding is stripped by a proxy first. If both appear, a compliant server must reject the request or strip Transfer-Encoding, because the two headers can disagree about where the body ends — this ambiguity is the root cause of request smuggling attacks.",
  },
  {
    q: "Is PUT always idempotent even if the server has a bug that makes it not so?",
    a: "The HTTP spec defines idempotency as a contract for how the method SHOULD behave, not a property the network enforces. A server that increments a counter on every PUT is violating the spec, and that matters because clients, proxies, and load balancers all assume PUT is safe to retry — violate it and you get silent double effects when a client times out and retries.",
  },
  {
    q: "Why does a GET request with a custom header trigger a CORS preflight but the same GET from curl works fine?",
    a: "CORS is a browser-enforced policy, not a server or protocol requirement. curl has no origin, no same-origin policy, and no concept of a preflight — it just sends the request and prints whatever comes back. A browser tab making the same call is bound by the Fetch spec's CORS algorithm, so a non-simple header forces an OPTIONS request first, and the browser blocks the response if Access-Control-Allow-Headers doesn't list that header.",
  },
  {
    q: "Does the OPTIONS preflight request actually reach my server's route handler?",
    a: "Yes, it hits your server like any other request unless something intercepts it earlier (a CDN, API gateway, or CORS middleware). Your server has to answer it with the right Access-Control-Allow-* headers and a 2xx status. If your route handler only implements GET and POST, an unhandled OPTIONS often falls through to a 404 or 405, which the browser interprets as a failed preflight and blocks the real request before it's ever sent.",
  },
  {
    q: "If I retry a POST that timed out, can I create a duplicate?",
    a: "Possibly, and this is exactly why POST is classified as neither safe nor idempotent. The request may have been processed and the response lost on the way back. The only reliable fixes are a server-generated idempotency key the client attaches to retries, or making the operation itself idempotent (e.g. PUT to a client-generated resource ID instead of POST to a collection).",
  },
];

export default function HttpAnatomyGuide() {
  return (
    <GuideLayout
      title="The Anatomy of an HTTP Request: Headers, Methods, and What cURL Actually Does"
      description="What actually goes over the socket in an HTTP request, what curl's flags map to on the wire, and why CORS breaks in the browser but never in curl."
      canonicalPath="/guides/http-request-anatomy"
      readingTime="10 min read"
      faqs={faqs}
      relatedTools={[{ label: "cURL to fetch/axios Converter", to: "/workspace/curl-converter" }]}
      relatedGuides={[{ label: "Converting cURL to fetch and axios", to: "/guides/curl-to-fetch" }]}
    >
      <p>
        Most people learn HTTP backward: fetch first, then curl, then — maybe — the actual bytes. That order
        works until something breaks in a way none of the abstractions explain. A request that succeeds in curl
        but fails in the browser with a CORS error. A POST that silently gets parsed as form data instead of
        JSON. A client that hangs forever because the server never sent a length the client could trust. All
        three have the same root cause: nobody looked at what is actually sitting on the wire. This guide does
        that.
      </p>

      <h2>The wire format</h2>
      <p>
        An HTTP/1.1 request is plain text (unless you're on HTTP/2 or HTTP/3, which frame things differently but
        preserve the same semantics). It has four parts, in this exact order: a request-line, one or more
        header lines, a blank line, and an optional body. Every line — including the blank one — ends in a
        carriage return followed by a line feed, written as <code>CRLF</code> or <code>\r\n</code>. Not just{" "}
        <code>\n</code>. This is a real distinction: a parser that only splits on <code>\n</code> will usually
        work by accident, but a strict HTTP/1.1 parser is entitled to reject a message that uses bare LF.
      </p>
      <p>Here is a real request, exactly as it appears on the socket:</p>
      <pre>
        <code>{`POST /api/orders HTTP/1.1
Host: api.example.com
Content-Type: application/json
Content-Length: 25
Connection: keep-alive

{"item":"widget","qty":3}`}</code>
      </pre>
      <p>
        Line by line: <code>POST /api/orders HTTP/1.1</code> is the request-line —{" "}
        <strong>method, space, request target (path plus query string), space, HTTP version</strong>. Every
        line after it up to the blank line is a header: <code>Name: value</code>, one per line. The blank line —
        just <code>\r\n</code> with nothing before it — is the header/body separator, and it is mandatory even
        when there is no body. Everything after that blank line, for exactly <code>Content-Length</code> bytes,
        is the body. If you count the JSON payload above, it's 25 bytes, which is why{" "}
        <code>Content-Length: 25</code> is correct — get that number wrong (by hand-building a request string,
        say) and the receiving side will either truncate your body or hang waiting for bytes that never come.
      </p>
      <p>
        With explicit line endings shown, the same request looks like this — this is closer to what a packet
        capture actually shows you:
      </p>
      <pre>
        <code>{`POST /api/orders HTTP/1.1\\r\\n
Host: api.example.com\\r\\n
Content-Type: application/json\\r\\n
Content-Length: 25\\r\\n
\\r\\n
{"item":"widget","qty":3}`}</code>
      </pre>

      <h2>What curl's flags actually do to that text</h2>
      <p>
        curl is a thin, honest wrapper over exactly this format — every flag maps to one specific piece of the
        request above, with no magic in between.
      </p>
      <ul>
        <li>
          <code>-X POST</code> writes the method token in the request-line. Without it, curl infers{" "}
          <code>GET</code> unless you also pass <code>-d</code>, in which case it infers <code>POST</code> — so{" "}
          <code>-X POST</code> is often redundant when <code>-d</code> is already present, though it's harmless
          to be explicit.
        </li>
        <li>
          <code>-H "Header: value"</code> inserts that exact string as a header line, verbatim, wherever curl
          places it in the header block. There's no validation beyond basic syntax — curl will happily send a
          header your server has never heard of.
        </li>
        <li>
          <code>-d '{`{"a":1}`}'</code> sets the body to that literal string and switches the method to{" "}
          <code>POST</code> if you haven't set one. This is the flag that causes the most conversion bugs. If
          you don't pass an explicit <code>-H "Content-Type: ..."</code>, curl adds{" "}
          <code>Content-Type: application/x-www-form-urlencoded</code> for you — not{" "}
          <code>application/json</code>, even though the body you typed looks exactly like JSON. curl doesn't
          parse the body to guess its shape; it just applies the historical default for <code>-d</code>, which
          predates JSON as a common wire format by a couple of decades. A server that does strict content
          negotiation will either 415 that request or, worse, silently try to parse{" "}
          <code>{`{"a":1}`}</code> as a URL-encoded form and get nothing useful out of it. This is the single
          most common reason a curl example "just works" in a terminal but the naive fetch translation
          (assuming JSON was implied) fails until you add the header explicitly.
        </li>
      </ul>

      <h2>Content-Length vs. Transfer-Encoding: chunked</h2>
      <p>
        A body has to end somewhere, and TCP doesn't tell you where — it's a byte stream with no message
        boundaries of its own. HTTP solves this with exactly two mechanisms, and a request or response with a
        body must use one of them (or the body must be empty).
      </p>
      <p>
        <code>Content-Length: N</code> is the simple case: read exactly <code>N</code> bytes after the blank
        line and stop. It requires the sender to know the full body size up front, which is easy for a small
        JSON payload and awkward for a response being generated on the fly (say, a database export streaming
        out row by row before the total size is known).
      </p>
      <p>
        <code>Transfer-Encoding: chunked</code> solves that case. Instead of one length up front, the body is
        split into chunks, each prefixed by its own size in hex followed by CRLF, ending in a zero-length chunk:
      </p>
      <pre>
        <code>{`7\\r\\n
Mozilla\\r\\n
9\\r\\n
Developer\\r\\n
0\\r\\n
\\r\\n`}</code>
      </pre>
      <p>
        That decodes to <code>MozillaDeveloper</code> — two chunks of 7 and 9 bytes, then a terminating
        zero-length chunk. The receiver stops reading when it sees that <code>0\r\n\r\n</code>, never needing a
        total length in advance.
      </p>
      <p>
        Without either header, there is no reliable way to know where the body ends short of the connection
        closing — and relying on connection-close as a boundary is exactly what HTTP/1.1 keep-alive was
        designed to avoid, since it forces a new TCP connection per request. This is also a security-relevant
        detail: request smuggling exploits arise specifically when a front-end proxy and a back-end server
        disagree about which of <code>Content-Length</code> or <code>Transfer-Encoding</code> governs a given
        message, and each ends the body at a different byte.
      </p>

      <h2>Safe and idempotent are not the same thing</h2>
      <p>
        RFC 9110 (formerly 7231) defines two separate properties per method, and conflating them is a common
        source of bad retry logic.
      </p>
      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Safe</th>
            <th>Idempotent</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>GET, HEAD, OPTIONS, TRACE</td>
            <td>Yes — no intended side effects</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>PUT, DELETE</td>
            <td>No</td>
            <td>Yes — repeating has the same effect as doing it once</td>
          </tr>
          <tr>
            <td>POST, PATCH</td>
            <td>No</td>
            <td>No — repeating can create a second effect</td>
          </tr>
        </tbody>
      </table>
      <p>
        "Safe" means the client isn't asking for anything beyond retrieval — a well-behaved <code>GET</code>{" "}
        shouldn't create a row or charge a card, even though nothing stops a badly-written server from doing so.
        "Idempotent" is a stronger, independent claim: <code>N</code> identical requests leave the resource in
        the same state as one request. <code>DELETE /orders/42</code> is idempotent because the order is gone
        whether you call it once or five times; the second through fifth calls just return 404 instead of 204,
        but nothing extra gets deleted.
      </p>
      <p>
        This is precisely why HTTP clients, browsers, and proxies feel free to auto-retry a <code>GET</code> or{" "}
        <code>PUT</code> that timed out, but never auto-retry a <code>POST</code>. If{" "}
        <code>POST /orders</code> times out after the server already created the order and the response is just
        lost on the way back, retrying blindly creates a second order. There's no generic way for the client to
        tell "no response" apart from "no effect." If you need retry-safe writes, use a client-supplied
        idempotency key the server can deduplicate against, or model the operation as an idempotent{" "}
        <code>PUT</code> to a specific resource ID instead of a <code>POST</code> to a collection.
      </p>

      <h2>Why CORS never shows up in curl but always shows up in the browser</h2>
      <p>
        CORS (Cross-Origin Resource Sharing) is not a property of HTTP the protocol — it's a policy the{" "}
        <em>browser</em> enforces on top of it, and curl has no browser inside it, so none of this applies when
        you run a request from the terminal.
      </p>
      <p>
        A cross-origin request counts as "simple" — no preflight needed — only if it's a <code>GET</code>,{" "}
        <code>HEAD</code>, or <code>POST</code>, uses only a small allow-listed set of headers, and its{" "}
        <code>Content-Type</code> is one of <code>text/plain</code>,{" "}
        <code>application/x-www-form-urlencoded</code>, or <code>multipart/form-data</code>. The moment you add
        a custom header (say, an <code>Authorization</code> bearer token or an{" "}
        <code>X-Requested-With</code>), use <code>Content-Type: application/json</code>, or use a method like{" "}
        <code>PUT</code> or <code>DELETE</code>, the request is "non-simple." For a non-simple request, the
        browser doesn't send your request first — it sends an <code>OPTIONS</code> request to the same URL,
        with no body, carrying <code>Access-Control-Request-Method</code> (the method you actually intend to
        use) and <code>Access-Control-Request-Headers</code> (the custom headers you're about to send). The
        server has to answer that preflight — usually before your route handler code even runs, if you're
        using CORS middleware — with matching <code>Access-Control-Allow-Origin</code>,{" "}
        <code>Access-Control-Allow-Methods</code>, and <code>Access-Control-Allow-Headers</code>. Only if those
        line up does the browser fire off your real request at all. If they don't line up, the browser never
        sends the real request and hands your JS a generic network error — the server response, if there even
        was one, is invisible to your code.
      </p>
      <p>
        curl sends none of this dance. There's no origin to compare against, no policy engine deciding whether
        a script "from" one page is allowed to read a response "from" another — that entire concept only exists
        because a browser is running script from an untrusted page and mediating what it can read back. curl
        just opens a socket and sends the one request you asked for. So a curl command from an API doc that
        works perfectly on the command line, converted line-for-line into a browser <code>fetch()</code>, can
        fail with a CORS error that has nothing to do with your JavaScript being wrong — it's the server's{" "}
        <code>Access-Control-Allow-*</code> configuration that curl never had to satisfy in the first place.
      </p>

      <h2>Try it</h2>
      <p>
        Paste a real API doc's curl example into the{" "}
        <Link to="/workspace/curl-converter">DevBox cURL Converter</Link> and check the generated headers
        against what's described here — specifically whether it had to add a{" "}
        <code>Content-Type</code> you didn't see in the original command, and whether the method and headers
        it produces would trigger a preflight if that generated code ran in a browser tab against a
        cross-origin API.
      </p>
    </GuideLayout>
  );
}
