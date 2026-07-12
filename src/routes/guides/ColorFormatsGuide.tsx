import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "What is the difference between HEX, RGB, and HSL?",
    a: "They describe the same colors in different ways. HEX and RGB both specify red, green, and blue channel values (HEX in hexadecimal, RGB in decimal). HSL describes a color by hue, saturation, and lightness, which is more intuitive for creating variations.",
  },
  {
    q: "Which color format should I use in CSS?",
    a: "Any of them work. HEX is compact and common for static colors. RGB/RGBA is handy when you need opacity. HSL is best when building palettes or theming because you can adjust lightness to create tints and shades.",
  },
  {
    q: "How do I add transparency to a HEX color?",
    a: "Use an 8-digit HEX (RRGGBBAA) where the last two digits are the alpha channel, or switch to rgba()/hsla() with an alpha value between 0 and 1.",
  },
  {
    q: "What is the difference between HSL and HSB/HSV?",
    a: "HSL uses lightness (0% is black, 100% is white, 50% is the pure hue). HSB/HSV uses brightness/value (100% is the pure hue, and you reduce it toward black). Design tools often show HSB, while CSS uses HSL.",
  },
  {
    q: "Are HEX and RGB colors identical?",
    a: "Yes. #3b82f6 and rgb(59, 130, 246) are exactly the same color — HEX is just the hexadecimal notation of the same three channel values.",
  },
];

export default function ColorFormatsGuide() {
  return (
    <GuideLayout
      title="HEX, RGB, and HSL Color Formats"
      description="How the three main web color formats relate, when to use each, how to add transparency, and why HSL makes building palettes easier."
      canonicalPath="/guides/color-formats"
      readingTime="5 min read"
      faqs={faqs}
      relatedTools={[
        { label: "Color Converter", to: "/workspace/color-converter" },
        { label: "SVG Optimizer", to: "/workspace/svg-optimizer" },
      ]}
      relatedGuides={[
        { label: "Optimizing SVGs for the web", to: "/guides/svg-optimization" },
        { label: "JSON formatting basics", to: "/guides/json-formatting" },
      ]}
    >
      <p>
        Every color on the web can be written several ways, and they all describe the same thing. Knowing how
        HEX, RGB, and HSL relate — and which one fits a given task — makes it much easier to build consistent
        palettes, add transparency, and create hover states that actually look intentional. This guide walks
        through the three formats and when to reach for each.
      </p>

      <h2>They are three notations for one idea</h2>
      <p>
        A screen produces color by mixing red, green, and blue light. HEX and RGB both specify how much of each
        channel to use; they differ only in notation. HSL takes a different, more human angle — describing a
        color by its hue, how saturated it is, and how light it is.
      </p>
      <table>
        <thead>
          <tr>
            <th>Format</th>
            <th>Example</th>
            <th>What it specifies</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>HEX</td><td><code>#3b82f6</code></td><td>Red, green, blue in hexadecimal (00–ff each)</td></tr>
          <tr><td>RGB</td><td><code>rgb(59, 130, 246)</code></td><td>Red, green, blue in decimal (0–255 each)</td></tr>
          <tr><td>HSL</td><td><code>hsl(217, 91%, 60%)</code></td><td>Hue (0–360°), saturation %, lightness %</td></tr>
        </tbody>
      </table>
      <p>
        All three examples above are the <em>same</em> blue. A converter simply translates between the
        notations.
      </p>

      <h2>HEX: compact and everywhere</h2>
      <p>
        A HEX color is <code>#RRGGBB</code>, where each pair is a channel from <code>00</code> to{" "}
        <code>ff</code> (0–255). <code>#3b82f6</code> means red <code>0x3b</code> (59), green <code>0x82</code>{" "}
        (130), blue <code>0xf6</code> (246). The three-digit shorthand <code>#f00</code> expands each digit, so
        it is equivalent to <code>#ff0000</code>. HEX is the default in most design tools and static CSS.
      </p>

      <h2>RGB: when you need channels or opacity</h2>
      <p>
        <code>rgb()</code> uses the same channels in decimal, which is handy when you are computing colors in
        code. Its main advantage is the alpha channel:
      </p>
      <pre>
        <code>{`rgb(59, 130, 246)        /* opaque */
rgba(59, 130, 246, 0.5)  /* 50% transparent */`}</code>
      </pre>
      <p>
        Modern CSS also accepts <code>rgb(59 130 246 / 50%)</code> with a slash for the alpha, unifying the
        syntax.
      </p>

      <h2>HSL: the format for building palettes</h2>
      <p>
        HSL is the one worth learning well because it maps to how designers think:
      </p>
      <ul>
        <li>
          <strong>Hue</strong> (0–360°) — the color itself: 0 is red, 120 is green, 240 is blue.
        </li>
        <li>
          <strong>Saturation</strong> (0–100%) — how vivid it is; 0% is grey.
        </li>
        <li>
          <strong>Lightness</strong> (0–100%) — 0% is black, 100% is white, 50% is the pure hue.
        </li>
      </ul>
      <p>
        The payoff: to make a hover state or a tint, keep hue and saturation fixed and change only lightness.
      </p>
      <pre>
        <code>{`--brand:       hsl(217, 91%, 60%);
--brand-hover: hsl(217, 91%, 52%);  /* darker */
--brand-tint:  hsl(217, 91%, 92%);  /* lighter background */`}</code>
      </pre>
      <p>
        Doing the same with HEX means guessing new digits for every channel. With HSL you adjust one number.
      </p>

      <h2>Which one should you use?</h2>
      <ul>
        <li>
          <strong>HEX</strong> — copying a single static color between a design tool and code.
        </li>
        <li>
          <strong>RGB / RGBA</strong> — when you need opacity or are manipulating channels programmatically.
        </li>
        <li>
          <strong>HSL / HSLA</strong> — when building a palette, theming, or generating light/dark variants.
        </li>
      </ul>
      <p>
        In practice most codebases mix them, and that is fine — they are interchangeable. A converter lets you
        move between formats without doing hexadecimal math by hand.
      </p>

      <h2>Try it</h2>
      <p>
        The <Link to="/workspace/color-converter">DevBox Color Converter</Link> shows HEX, RGB, and HSL side by
        side and updates live as you pick a color, so you can grab whichever notation your CSS needs. If you
        work with vector icons, the <Link to="/guides/svg-optimization">SVG optimization guide</Link> pairs
        well.
      </p>
    </GuideLayout>
  );
}
