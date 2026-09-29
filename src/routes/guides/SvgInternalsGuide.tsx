import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "Why does a hand-written path look nothing like an exported one?",
    a: "Mostly the case of the command letters. Hand-written paths mix relative commands (lowercase l, c, q) that only encode a delta from the current point, which stays short. Exporters default to absolute commands (uppercase) for every segment, so each one repeats the full coordinate pair even when the shape only moved a few units.",
  },
  {
    q: "Does converting absolute path commands to relative ones change how the path looks?",
    a: "No. M10 10 L90 10 and M10 10 l80 0 draw the identical line — relative coordinates are just an offset from wherever the pen currently is. An optimizer only rewrites the encoding, never the geometry, unless it's also rounding precision.",
  },
  {
    q: "Is it safe to truncate path coordinate precision?",
    a: "Almost always, but not unconditionally. Rounding 12.4999999 to 12.5 or even 12 is invisible at normal screen sizes because a pixel can't show a ten-thousandth of a unit anyway. At high zoom, or on a path built from many tiny segments where rounding error compounds, aggressive truncation can visibly shift edges. That's why optimizers expose the precision as a setting rather than hardcoding it.",
  },
  {
    q: "Why does an SVG stay sharp when I zoom in but a PNG icon gets blurry?",
    a: "A PNG is already a fixed grid of pixels; zooming just stretches those pixels. An SVG has no pixels stored at all — it's a set of mathematical path and shape descriptions. The browser rasterizes (scan-converts) it fresh at whatever resolution the current zoom level needs, so the edges are recomputed, not stretched.",
  },
  {
    q: "If I inline an SVG in my HTML, do I lose caching?",
    a: "Yes, for that specific instance. An inlined <svg> is parsed as part of the page's own DOM and is not a separate cacheable resource, so it's re-downloaded (as part of the HTML) on every page that inlines it. A linked file (<img src> or a CSS background-image) is fetched once and cached by the browser across every page that references it, at the cost of not being stylable per sub-element from the parent page's CSS.",
  },
  {
    q: "Can I style individual parts of an SVG with CSS either way?",
    a: "Only if it's inlined. Inline SVG nodes are real DOM elements, so a rule like svg path:hover { fill: red; } works the same as it would on any other element. A linked SVG file is opaque from the parent document's perspective — you can resize or filter the whole image, but you can't reach inside it with the host page's stylesheet.",
  },
];

export default function SvgInternalsGuide() {
  return (
    <GuideLayout
      title="How SVG Rendering Works: Path Data, the DOM, and Where Optimizers Find Savings"
      description="The d attribute's command grammar, why exported SVGs bloat, and how the browser turns path data into pixels at every zoom level."
      canonicalPath="/guides/svg-rendering-internals"
      readingTime="10 min read"
      faqs={faqs}
      relatedTools={[{ label: "SVG Optimizer", to: "/workspace/svg-optimizer" }]}
      relatedGuides={[{ label: "Optimizing SVGs for the Web", to: "/guides/svg-optimization" }]}
    >
      <p>
        The <Link to="/guides/svg-optimization">practical guide to SVG optimization</Link> covers what to strip
        and when to inline versus link a file. This one goes underneath that: what the <code>d</code> attribute
        actually says, why an exporter and a human produce wildly different byte counts for the same shape, and
        what the browser does with that string between parsing it and putting pixels on screen.
      </p>

      <h2>The path data mini-language</h2>
      <p>
        Everything a <code>&lt;path&gt;</code> draws lives in one attribute, <code>d</code>, whose value is a
        tiny language of its own: a sequence of single-letter commands, each followed by the numeric arguments
        that command needs. There's no punctuation beyond whitespace and optional commas between numbers — a
        parser just reads a letter, then consumes however many numbers that letter requires, then looks for the
        next letter.
      </p>
      <p>The commands that matter in practice:</p>
      <ul>
        <li>
          <strong>M / m</strong> — moveto. Picks up the pen and puts it down at a point without drawing.
          Starts every subpath.
        </li>
        <li>
          <strong>L / l</strong> — lineto. Draws a straight segment from the current point to the given point.
        </li>
        <li>
          <strong>C / c</strong> — cubic Bézier curveto. Takes three coordinate pairs: the first control point,
          the second control point, and the endpoint. The curve leaves the current point heading toward the
          first control point and arrives at the endpoint heading away from the second.
        </li>
        <li>
          <strong>Q / q</strong> — quadratic Bézier curveto. One coordinate pair for a single control point,
          then one for the endpoint — cheaper to encode than a cubic, less flexible in shape.
        </li>
        <li>
          <strong>A / a</strong> — elliptical arc. Six arguments: rx, ry, x-axis-rotation, large-arc-flag,
          sweep-flag, then the endpoint x,y. The two flags disambiguate which of the (up to four) possible
          arcs between the current point and the endpoint gets drawn, since an ellipse with given radii can
          connect two points multiple ways.
        </li>
        <li>
          <strong>Z / z</strong> — closepath. Draws a straight line back to the start of the current subpath
          and, unlike the others, takes no arguments. <code>Z</code> and <code>z</code> are identical.
        </li>
      </ul>
      <p>
        Every letter other than <code>Z</code> comes in two cases, and the case is the single most consequential
        fact about path data: <strong>uppercase means the coordinates that follow are absolute</strong>,
        anchored to the SVG's coordinate system, while <strong>lowercase means the coordinates are relative</strong>
        {" "}to wherever the pen currently sits. <code>L 90 10</code> means "draw a line to the point (90, 10)."
        {" "}<code>l 80 0</code> means "draw a line 80 units right and 0 units down from here" — a completely
        different instruction that happens to draw the same segment if the pen was already at (10, 10). Mix the
        two freely in one path; the parser just tracks the current point and applies each command's rule as it
        goes.
      </p>

      <h2>Walking a path by hand</h2>
      <p>Take a minimal triangle:</p>
      <pre>
        <code>{`M10 10 L90 10 L90 90 Z`}</code>
      </pre>
      <p>A renderer processes this left to right, one command at a time:</p>
      <ol>
        <li>
          <code>M10 10</code> — lift the pen, place it at (10, 10). This becomes the current point and the
          start-of-subpath marker (needed later for <code>Z</code>).
        </li>
        <li>
          <code>L90 10</code> — draw a straight line from (10, 10) to (90, 10). Current point is now (90, 10).
          Because y didn't change, this reads as a horizontal line across the top of the shape.
        </li>
        <li>
          <code>L90 90</code> — draw a straight line from (90, 10) to (90, 90). Current point is now (90, 90).
          x didn't change here, so this is a vertical line down the right side.
        </li>
        <li>
          <code>Z</code> — draw a straight line from the current point (90, 90) back to the subpath's start,
          (10, 10). This is the diagonal hypotenuse, and it's implicit — nothing in the string says "(10, 10)"
          a second time.
        </li>
      </ol>
      <p>
        Three explicit points and one closing rule produced a filled triangle. Written with relative commands
        instead — <code>{`m10 10 l80 0 l0 80 z`}</code> — it draws the exact same shape, because each lowercase
        command is just "from here, go this far."
      </p>

      <h2>Why exported SVGs balloon</h2>
      <p>
        Open a path exported from Illustrator, Figma, or Sketch and it rarely resembles the triangle above, even
        for equally simple geometry. Four habits account for almost all of the difference:
      </p>
      <ul>
        <li>
          <strong>Absolute everywhere.</strong> Exporters emit uppercase commands for every segment instead of
          switching to relative ones when the delta is small. A shape that could say <code>l5 0</code> instead
          repeats a full pair of large absolute coordinates.
        </li>
        <li>
          <strong>Excess decimal precision.</strong> Internal editor math routinely produces values like{" "}
          <code>10.0000001</code> or <code>47.38299999</code> where <code>10</code> or <code>47.383</code> would
          render identically on screen. Every one of those extra digits is pure byte cost.
        </li>
        <li>
          <strong>No deduplication.</strong> If the same curve or icon shape appears four times, a design tool
          typically writes out four full copies of the path data rather than defining it once and referencing it
          with <code>&lt;use&gt;</code>.
        </li>
        <li>
          <strong>Editor-only baggage.</strong> Namespaced attributes like <code>sodipodi:*</code> or{" "}
          <code>inkscape:*</code>, empty wrapper <code>&lt;g&gt;</code> groups left over from layer panels, and{" "}
          <code>&lt;defs&gt;</code> blocks defining gradients or clip paths nothing in the visible document uses.
          None of it affects a single pixel; all of it round-trips back into the editor's own file format, which
          is what the export is actually optimized for.
        </li>
      </ul>
      <p>The same rectangle outline, exported versus hand-optimized:</p>
      <pre>
        <code>{`<!-- exported -->
<path d="M10.0000001,10.0000000 L90.0000004,10.0000000
         L90.0000004,90.0000004 L10.0000001,90.0000004 Z"/>

<!-- hand-optimized -->
<path d="M10 10 h80 v80 h-80 Z"/>`}</code>
      </pre>
      <p>
        The optimized version does two things at once: it truncates precision (no shape needs eight decimal
        digits to hit an integer grid), and it swaps in <code>h</code>/<code>v</code> — horizontal and vertical
        lineto shorthands, each taking a single number instead of a full coordinate pair, since only one axis
        changes. Same rectangle, roughly a third of the characters.
      </p>

      <h2>What an optimizer's passes actually do</h2>
      <p>
        A tool like SVGO isn't one transformation, it's a pipeline of small, mostly independent passes, each
        targeting one of the patterns above:
      </p>
      <table>
        <thead>
          <tr>
            <th>Pass</th>
            <th>What it does</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Strip metadata</td>
            <td>
              Removes comments, XML declarations, editor namespaces, and unreferenced <code>&lt;defs&gt;</code>{" "}
              entries.
            </td>
          </tr>
          <tr>
            <td>Collapse empty groups</td>
            <td>Deletes <code>&lt;g&gt;</code> wrappers with no attributes and no useful nesting purpose.</td>
          </tr>
          <tr>
            <td>Round coordinates</td>
            <td>
              Truncates decimal precision to a configurable number of digits. This is the one pass with a real
              fidelity tradeoff — too aggressive and detailed curves visibly shift at high zoom.
            </td>
          </tr>
          <tr>
            <td>Convert to relative</td>
            <td>
              Rewrites absolute commands as relative ones (and picks whichever encoding is shorter per segment),
              plus swaps in shorthands like <code>h</code>/<code>v</code>/<code>s</code>/<code>t</code> where the
              geometry allows it.
            </td>
          </tr>
          <tr>
            <td>Merge path segments</td>
            <td>
              Combines consecutive commands of the same type (<code>L x1 y1 L x2 y2</code> patterns and similar)
              and drops no-op segments that don't move the pen.
            </td>
          </tr>
          <tr>
            <td>Collapse transforms</td>
            <td>
              Multiplies chained <code>transform</code> matrices on nested elements down into a single matrix,
              or bakes the transform directly into the coordinates and removes the attribute.
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        None of these passes change what the path describes geometrically (aside from precision rounding, which
        changes it by a deliberately negligible amount). They change how the same geometry is encoded — which is
        exactly why running the same file through an optimizer twice yields no further savings on the second
        pass.
      </p>

      <h2>From markup to pixels</h2>
      <p>
        What makes SVG behave so differently from a raster image starts before any of this — with what an{" "}
        <code>&lt;svg&gt;</code> element actually is. When the browser parses an inline <code>&lt;svg&gt;</code>,
        it isn't decoding image bytes; it's building ordinary DOM nodes, the same kind of tree it builds for{" "}
        <code>&lt;div&gt;</code> or <code>&lt;table&gt;</code>. Each <code>&lt;path&gt;</code>, <code>&lt;circle&gt;</code>,
        and <code>&lt;g&gt;</code> is a real node you can query with <code>querySelector</code>, mutate with JS, or
        target with a CSS selector, and it participates in the accessibility tree like any other element.
      </p>
      <p>
        From that DOM, the rendering engine builds a render tree and, for each SVG shape, computes the actual
        geometry — resolving the path data, any transforms, and inherited styles — and scan-converts it: walking
        the shape's outline and deciding, at the current output resolution, exactly which pixels fall inside it
        and how to blend edges that only partially cover a pixel (anti-aliasing). Critically, that resolution
        isn't fixed. Zoom the page, resize the viewport, or scale the element with CSS, and the engine reruns
        scan conversion against the new pixel grid, using the same underlying path data. There's no stored bitmap
        to stretch — the shape is redrawn from its mathematical description every time the output size changes,
        which is the entire reason it stays crisp at any zoom level. A PNG has no equivalent step: its pixels
        were fixed at export time, so zooming can only interpolate between pixels that already exist, not
        recompute new ones.
      </p>

      <h2>Inline versus linked, and why it isn't just a style preference</h2>
      <p>
        Because an inlined SVG is genuinely part of the page's DOM, it can be styled and animated the way any
        other element can: a CSS rule can change one <code>&lt;path&gt;</code>'s fill on hover, a class toggle
        can trigger a stroke animation, JavaScript can read and rewrite the <code>d</code> attribute directly.
        None of that is available to a linked SVG — one loaded via <code>&lt;img src="icon.svg"&gt;</code> or a
        CSS <code>background-image</code>. The browser treats a linked SVG like any other image resource: it
        renders as an opaque box from the host page's point of view, so you can resize it, apply CSS filters to
        the whole image, or swap the file, but you cannot reach into it to recolor a single stroke from the
        parent document's stylesheet.
      </p>
      <p>
        The tradeoff runs the other way for caching. A linked file is a normal HTTP resource — fetched once,
        cached by the browser, and reused across every page and every repeated <code>&lt;img&gt;</code> tag that
        points at it. An inlined <code>&lt;svg&gt;</code> has no independent existence as a resource; it's markup
        baked into the HTML (or hydrated into the DOM by JS), so it travels with every page that embeds it and
        gets no caching benefit of its own. A repeated icon used sitewide is usually cheaper linked; an icon that
        needs per-instance styling or a hover animation usually needs to be inline.
      </p>

      <h2>Try it</h2>
      <p>
        Paste a path from an actual export into the <Link to="/workspace/svg-optimizer">DevBox SVG Optimizer</Link>{" "}
        and diff the <code>d</code> attribute before and after — the absolute-to-relative conversion and the
        precision truncation are usually visible in the first few characters.
      </p>
    </GuideLayout>
  );
}
