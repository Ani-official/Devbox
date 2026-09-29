import { Link } from "react-router-dom";
import GuideLayout from "../../components/GuideLayout";
import type { Faq } from "../../components/GuideLayout";

const faqs: Faq[] = [
  {
    q: "Is the sRGB gamma really just 2.2?",
    a: "Not exactly. The sRGB transfer function is piecewise: a straight line near black (to avoid an infinite slope at zero) and a power curve with exponent 2.4 everywhere else. A single x^2.2 power curve is a common approximation of the whole thing, and it's close enough for casual use, but it isn't the actual formula the spec defines.",
  },
  {
    q: "Why does my CSS linear-gradient look dull or gray in the middle?",
    a: "Because by default, gradients (and most image resizing) interpolate the stored, gamma-encoded channel values directly instead of converting to linear light first. Two saturated, bright colors averaged this way produce a darker, duller midpoint than a linear-light blend would. CSS color-mix() and gradients can be told to interpolate in oklab or srgb-linear to fix this.",
  },
  {
    q: "Should I rewrite all my HSL variables as OKLCH?",
    a: "Not necessarily — HSL is fine for one-off tweaks. But if you're generating a scale of shades across multiple hues (like a design-token ramp from 50 to 900), OKLCH avoids the mismatch where equal lightness numbers produce very different perceived brightness for different hues.",
  },
  {
    q: "Does this affect image resizing too, not just flat colors?",
    a: "Yes. A box or bilinear filter applied directly to gamma-encoded pixel bytes over-weights dark pixels and under-weights bright ones, which is the same error as averaging two hex colors incorrectly. It shows up as slightly dimmed, muddy edges when downscaling high-contrast images. Correct resampling converts to linear light, filters, then converts back.",
  },
  {
    q: "Is CIELAB or OKLab 'the correct' color space the way linear light is physically correct?",
    a: "No — linear light is a physical quantity (radiometric intensity). CIELAB and OKLab are perceptual models fit to human color-matching experiments, so they approximate how differences look rather than measuring photons. OKLab is a newer fit that corrects several known hue-uniformity problems in the older CIELAB model, but both are models, not physical measurements.",
  },
];

export default function ColorTheoryGuide() {
  return (
    <GuideLayout
      title="Color Theory for Developers: Gamma Correction and Why HSL Isn't Perceptually Uniform"
      description="Why sRGB hex/RGB values are gamma-encoded rather than linear light, why averaging hex colors gives the wrong gray, and why HSL only relabels RGB instead of fixing it."
      canonicalPath="/guides/color-theory"
      readingTime="9 min read"
      faqs={faqs}
      relatedTools={[{ label: "Color Converter (HEX / RGB / HSL)", to: "/workspace/color-converter" }]}
      relatedGuides={[{ label: "HEX, RGB, and HSL Color Formats", to: "/guides/color-formats" }]}
    >
      <p>
        At some point you've built a gradient, or blended a semi-transparent overlay, and stared at the result
        wondering why the middle looks like wet cardboard instead of a clean blend of the two end colors. Or
        you've averaged two hex colors to get a "halfway" gray and it came out noticeably darker than it should.
        Neither of those is a bug in your code. It's that the numbers stored in a hex or RGB triple are not
        linear measurements of light output — they're gamma-encoded — and HSL doesn't fix that, it just relabels
        the same non-linear numbers in a friendlier coordinate system. This guide covers the actual math: what
        gamma encoding is and why it exists, why naive averaging of sRGB values gives the wrong midpoint, why
        HSL isn't perceptually uniform, and where CIELAB and OKLab/OKLCH fit in.
      </p>

      <h2>sRGB values are gamma-encoded, not linear light</h2>
      <p>
        When you write <code>#808080</code> or <code>rgb(128, 128, 128)</code>, it's tempting to think of 128
        as "half the brightness" of 255. It isn't. The channel values in HEX and RGB are defined by the sRGB
        standard as gamma-encoded numbers: they've been passed through a nonlinear encoding curve before
        storage, and a display has to decode them back before turning them into actual photons.
      </p>
      <p>
        The reason has to do with how contrast sensitivity works, not aesthetics. Human vision is far more
        sensitive to differences between dark tones than to differences between bright ones — roughly
        logarithmic rather than linear. If you stored raw linear-light intensities in 8 bits per channel, you'd
        spend huge numbers of code values distinguishing shades of near-white that nobody can tell apart, and
        only a handful of code values covering the shadow range where banding is very visible. Gamma encoding
        front-loads precision into the dark end, so 8 bits per channel look smooth where it matters.
      </p>
      <p>
        The actual sRGB transfer function (its EOTF, for decoding stored values back to linear light) is
        piecewise, not a bare power curve. There's a short linear segment near black, then a power curve with
        exponent 2.4:
      </p>
      <pre>
        <code>{`// c is a single channel, normalized to 0..1 (i.e. byteValue / 255)

function srgbToLinear(c) {
  // decode: gamma-encoded sRGB -> linear light
  if (c <= 0.04045) return c / 12.92;
  return Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c) {
  // encode: linear light -> gamma-encoded sRGB
  if (c <= 0.0031308) return c * 12.92;
  return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}`}</code>
      </pre>
      <p>
        People round this off to "gamma 2.2" because a single x^2.2 power curve is a decent overall fit to the
        combined curve, and 2.2 is a convenient number to say out loud. But the spec's actual curve has that
        linear toe near zero (to keep the slope finite at c = 0, which a pure power function can't do) and uses
        2.4 as the exponent on the power segment. If you only remember "gamma 2.2" you'll get close-ish answers;
        if you need the math to actually check out, use the piecewise version.
      </p>

      <h2>The averaging trap: #FFFFFF and #000000 don't average to mid-gray</h2>
      <p>
        Here's the consequence that actually bites people. Average white and black channel-by-channel the
        obvious way: (255 + 0) / 2 = 127.5, rounds to 128, which is <code>#808080</code>. That looks like the
        midpoint, and in the stored, gamma-encoded numbers, it is. But it is not the color that emits half as
        many photons as white.
      </p>
      <p>
        To find that, you have to leave the encoded space. Decode both endpoints to linear light (white decodes
        to 1.0, black to 0.0), average in linear light where light intensities actually add the way you'd
        expect (0.5), and then re-encode that back to sRGB for storage/display:
      </p>
      <pre>
        <code>{`const whiteLin = srgbToLinear(1);          // 1.0
const blackLin = srgbToLinear(0);          // 0.0
const midLin = (whiteLin + blackLin) / 2;  // 0.5  <- correct in linear light
const midSrgb = linearToSrgb(midLin);      // ~0.735

// 0.735 * 255 ≈ 187.5 -> byte value 188 -> hex 0xBC
// so the true linear-light 50% gray is close to #BCBCBC, not #808080`}</code>
      </pre>
      <p>
        <code>#BCBCBC</code> is noticeably lighter than <code>#808080</code> because it's the value that
        actually produces half the light output of white; <code>#808080</code> emits far less than half of
        white's light — it only looks like a fair midpoint because the arithmetic was done in the wrong,
        compressed space. This is exactly why a naive gradient or image blend between a bright color and a dark
        one tends to look darker and duller through the middle than you'd expect: the interpolation is
        happening on gamma-encoded bytes, not on light.
      </p>

      <h2>HSL is the same RGB numbers wearing a trenchcoat</h2>
      <p>
        HSL doesn't touch any of this. Hue, saturation, and lightness are computed directly from the same
        gamma-encoded R, G, B channel values — it's a cylindrical-coordinate relabeling, not a different measure
        of color. Given an RGB triple, HSL's lightness is literally (max(R,G,B) + min(R,G,B)) / 2 of those
        gamma-encoded values, and hue is an angle derived from which channel is largest and by how much.
        Nothing in that computation involves linear light, luminance, or anything the eye measures directly —
        it is a geometric repackaging of RGB designed to be easier for a human to reason about ("keep the hue,
        make it lighter," "keep the lightness, make it more saturated"), and it succeeds at that. It does not
        succeed at making equal numeric steps correspond to equal perceived brightness steps.
      </p>
      <p>
        The clearest demonstration: <code>hsl(60, 100%, 50%)</code> is pure yellow, and{" "}
        <code>hsl(240, 100%, 50%)</code> is pure blue. Both have lightness 50 by the HSL formula. They do not
        look equally bright — pure yellow at L=50 looks strikingly bright and almost pastel, while pure blue at
        L=50 looks dark and saturated, closer to navy than to a mid-tone. That's because actual visual
        brightness (relative luminance) weights green heavily and blue very lightly — the standard weighting is
        roughly 0.2126 for red, 0.7152 for green, and 0.0722 for blue, applied to linear-light values — and
        yellow is red plus green, so it inherits a lot of that green weight, while blue barely registers. HSL's
        lightness formula knows nothing about this; it just takes (max + min) / 2 of the raw channel bytes, so
        two colors with wildly different actual luminance can share the same "L."
      </p>

      <h2>Perceptually uniform spaces: CIELAB and OKLab/OKLCH</h2>
      <p>
        CIELAB (L*a*b*), from 1976, was built specifically to fix this: it's derived from human color-matching
        experiments so that Euclidean distance between two points in the space corresponds reasonably well to
        perceived difference between the colors, and its L* channel is a compressed function of relative
        luminance (from linear-light CIE XYZ), not a max/min shortcut on encoded RGB. It became the basis for
        things like the deltaE color-difference metrics used in print and photography.
      </p>
      <p>
        OKLab, published by Björn Ottosson in 2020, is a newer perceptual space that fixes known unevenness in
        CIELAB (particularly around blues and purples) using more modern vision data and a cone-response model.
        OKLCH is OKLab's cylindrical form — lightness, chroma, hue — the direct structural analog of{" "}
        <code>hsl()</code>, but built on a space that is actually close to perceptually uniform. Raising L in
        OKLCH moves toward a color that reliably looks lighter regardless of hue, and changing hue while holding
        L and C roughly preserves apparent brightness. That property is exactly what HSL is missing, and it's
        why CSS Color Level 4 added <code>oklch()</code> as a first-class color function, and why palette and
        design-token generators increasingly build shade scales in OKLCH instead of HSL — an OKLCH-based ramp
        doesn't have the "the yellow-500 swatch looks way brighter than the blue-500 swatch" problem that shows
        up when a scale is generated purely from HSL lightness steps.
      </p>
      <table>
        <thead>
          <tr>
            <th>Space</th>
            <th>Built from</th>
            <th>Equal steps ≈ equal perceived change?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>HSL / HSV</td>
            <td>Cylindrical transform of gamma-encoded RGB</td>
            <td>No — varies a lot by hue</td>
          </tr>
          <tr>
            <td>CIELAB</td>
            <td>Human matching experiments, linear-light XYZ luminance</td>
            <td>Approximately, with known hue-dependent skew</td>
          </tr>
          <tr>
            <td>OKLab / OKLCH</td>
            <td>Modern cone-response fit, corrects CIELAB's skew</td>
            <td>Closer still, and the current CSS-recommended choice</td>
          </tr>
        </tbody>
      </table>

      <h2>Alpha compositing has the identical problem</h2>
      <p>
        Standard alpha (over) compositing looks like a simple lerp per channel:
      </p>
      <pre>
        <code>{`result = fg * alpha + bg * (1 - alpha)`}</code>
      </pre>
      <p>
        That formula is physically correct only when <code>fg</code> and <code>bg</code> are linear-light
        values, because light intensities really do add and scale linearly — that's the whole physical premise
        behind it. Most implementations — CSS's own compositing, canvas 2D, and plenty of image libraries —
        apply that formula directly to the stored gamma-encoded sRGB bytes anyway, because it's cheaper and
        historically that's just how 8-bit image formats were built. The visible cost shows up at edges: an
        anti-aliased boundary between two high-contrast colors (black text on a white background is the classic
        case, or a translucent white panel over a saturated color) ends up slightly darker and grayer than a
        "physically correct" linear-light blend would produce, because the partial-coverage pixels are being
        averaged in the wrong, compressed space, the same error as the white/black gray example above. Some
        rendering paths let you opt into linear-light blending explicitly — SVG's{" "}
        <code>color-interpolation</code> property, WebGL textures sampled as linear, and CSS's{" "}
        <code>color-mix()</code> when you specify the <code>oklab</code> interpolation space — trading a small
        amount of performance for edges that don't have that faint muddy halo.
      </p>

      <h2>Try it</h2>
      <p>
        None of this means you should stop using HEX, RGB, or HSL day to day — they're the formats CSS and most
        tooling expect, and for picking a single static color or nudging a hover state, HSL's intuitiveness is
        still genuinely useful. The math above matters when you're interpolating, blending, or generating a
        scale of colors and the result needs to look as even as the numbers suggest. The{" "}
        <Link to="/workspace/color-converter">DevBox Color Converter</Link> converts between HEX, RGB, and HSL
        instantly if you just need to move between notations; for the syntax-level differences between the
        formats themselves, see the{" "}
        <Link to="/guides/color-formats">HEX, RGB, and HSL color formats guide</Link>.
      </p>
    </GuideLayout>
  );
}
