import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "Does optimizing an SVG change how it looks?",
    a: "Done correctly, no. Optimization removes editor metadata, comments, and redundant data that do not affect rendering. Aggressive options that round path coordinates too far can shift the image, so review the result for detailed artwork.",
  },
  {
    q: "Why are SVGs from Figma or Illustrator so large?",
    a: "Design tools add editor metadata, hidden layers, generous coordinate precision, and namespaced attributes you do not need on the web. Stripping that bloat often cuts the file size substantially with no visible change.",
  },
  {
    q: "Should I inline SVGs or link them as files?",
    a: "Inline an SVG when you need to style or animate it with CSS, or to avoid a request for a critical icon. Link it as a file (or use a sprite) when the same icon repeats many times, so the browser can cache it once.",
  },
  {
    q: "Is it safe to paste an SVG from an untrusted source?",
    a: "Be careful. SVGs can contain <script> elements and event handlers. Optimizers that strip scripts help, but always sanitize SVGs from untrusted sources before rendering them inline.",
  },
  {
    q: "What is the single biggest win when optimizing an SVG?",
    a: "Removing editor metadata and reducing coordinate precision usually account for most of the savings, followed by collapsing redundant groups and stripping default attribute values.",
  },
];

export default function SvgOptimizationGuide() {
  return (
    <GuideLayout
      title="Optimizing SVGs for the Web"
      description="Why exported SVGs are bloated, what optimization safely removes, when to inline vs. link, and how to keep icons small without changing how they look."
      canonicalPath="/guides/svg-optimization"
      readingTime="6 min read"
      faqs={faqs}
      relatedTools={[
        { label: "SVG Optimizer", to: "/workspace/svg-optimizer" },
        { label: "Color Converter", to: "/workspace/color-converter" },
      ]}
      relatedGuides={[
        { label: "HEX, RGB, and HSL colors", to: "/guides/color-formats" },
        { label: "Base64 encoding explained", to: "/guides/base64-encoding" },
      ]}
    >
      <p>
        SVG is the best format for icons, logos, and simple illustrations on the web: it scales to any size
        without blurring and usually weighs less than a raster image. But an SVG exported straight from a
        design tool is often two or three times larger than it needs to be, padded with metadata the browser
        never uses. Optimizing it trims that fat without touching how the image looks.
      </p>

      <h2>Why exported SVGs are bloated</h2>
      <p>
        Design tools optimize for round-tripping their own files, not for the web. A fresh export commonly
        includes:
      </p>
      <ul>
        <li>Editor metadata and namespaces (for example <code>sodipodi</code> or <code>inkscape</code> attributes).</li>
        <li>XML declarations, comments, and <code>&lt;title&gt;</code>/<code>&lt;desc&gt;</code> boilerplate.</li>
        <li>Coordinate values with far more decimal precision than a screen can show.</li>
        <li>Redundant wrapper <code>&lt;g&gt;</code> groups and default attribute values.</li>
        <li>Hidden or empty elements left over from the design process.</li>
      </ul>
      <p>None of this affects rendering, so all of it is safe to remove.</p>

      <h2>What optimization removes</h2>
      <p>Consider a snippet from a typical export:</p>
      <pre>
        <code>{`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:sodipodi="..." width="24.0000" height="24.0000">
  <!-- Created with a design tool -->
  <g id="layer1">
    <path d="M12.00000,2.00000 L20.00000,7.00000"
          fill="#000000" stroke-width="1.00000"/>
  </g>
</svg>`}</code>
      </pre>
      <p>After optimization the same icon becomes:</p>
      <pre>
        <code>{`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
  <path d="M12 2 20 7" stroke-width="1"/>
</svg>`}</code>
      </pre>
      <p>
        The XML declaration, comment, editor namespace, redundant group, and excess precision are gone, and{" "}
        <code>fill="#000000"</code> (a default) was dropped. Same picture, a fraction of the bytes.
      </p>

      <h2>The optimizations that matter most</h2>
      <table>
        <thead>
          <tr>
            <th>Optimization</th>
            <th>Why it helps</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Remove editor metadata</td><td>Large blocks of unused attributes and namespaces disappear.</td></tr>
          <tr><td>Reduce coordinate precision</td><td>Screens cannot show 5 decimals; 1–2 is plenty and much shorter.</td></tr>
          <tr><td>Collapse redundant groups</td><td>Fewer DOM nodes render faster and read cleaner.</td></tr>
          <tr><td>Strip comments and defaults</td><td>Removes bytes with zero visual effect.</td></tr>
          <tr><td>Minify whitespace</td><td>Newlines and indentation are not needed at serve time.</td></tr>
        </tbody>
      </table>
      <p>
        Be cautious with precision: rounding coordinates too aggressively can visibly distort detailed
        artwork. For simple icons it is safe; for complex illustrations, review the result.
      </p>

      <h2>Inline vs. linked SVGs</h2>
      <ul>
        <li>
          <strong>Inline</strong> the SVG markup directly in your HTML when you need to style or animate it with
          CSS (for example, changing an icon's color on hover), or to avoid an extra request for a critical
          above-the-fold icon.
        </li>
        <li>
          <strong>Link</strong> it as a file — or use an SVG sprite — when the same icon appears many times, so
          the browser downloads and caches it once instead of repeating the markup.
        </li>
      </ul>

      <h2>A quick security note</h2>
      <blockquote>
        SVG is XML and can contain <code>&lt;script&gt;</code> elements and event handlers. Never render an SVG
        from an untrusted source inline without sanitizing it first.
      </blockquote>

      <h2>A simple workflow</h2>
      <ol>
        <li>Export the SVG from your design tool.</li>
        <li>Run it through an optimizer to strip metadata, comments, and excess precision.</li>
        <li>Preview the result at the sizes you will actually use it.</li>
        <li>Inline it or save it as a file depending on how often it repeats.</li>
      </ol>

      <h2>Try it</h2>
      <p>
        The <Link to="/workspace/svg-optimizer">DevBox SVG Optimizer</Link> cleans up markup in your browser
        and previews the result so you can confirm nothing shifted. If you tweak icon colors, the{" "}
        <Link to="/guides/color-formats">color formats guide</Link> explains HEX, RGB, and HSL.
      </p>
    </GuideLayout>
  );
}
