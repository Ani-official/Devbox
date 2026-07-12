import { Link } from "react-router-dom";
import PageMeta from "../components/PageMeta";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageMeta
        title="Privacy Policy | DevBox"
        description="Read DevBox's privacy policy, including browser-side storage, analytics, and Google AdSense-related disclosures."
        canonicalPath="/privacy-policy"
      />

      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">Effective date: June 24, 2026</p>

      <p className="mb-4">
        DevBox operates the website <strong>devbox-gamma.vercel.app</strong>. This policy explains what information we collect,
        how we use it, and how third-party services such as Google AdSense may process data when ads are shown.
      </p>

      <h2 className="mt-6 text-2xl font-semibold">Information We Collect</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Basic browser and device information used for analytics, diagnostics, and ad delivery.</li>
        <li>Cookies and similar technologies used by Google and other providers for ad serving and measurement.</li>
        <li>Local storage values saved by tool pages so users can return to recent inputs and preferences.</li>
      </ul>

      <h2 className="mt-6 text-2xl font-semibold">How We Use Information</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>To provide the developer tools and keep the site running smoothly.</li>
        <li>To understand which pages and tools are useful so we can improve them.</li>
        <li>To display and measure ads through Google AdSense where enabled.</li>
      </ul>

      <h2 className="mt-6 text-2xl font-semibold">Google AdSense</h2>
      <p className="mb-3">
        Google may use cookies, device identifiers, and similar technologies to show and measure ads. You can learn more in
        Google&apos;s advertising privacy information at{" "}
        <a
          href="https://policies.google.com/technologies/ads"
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          Google Ads Privacy
        </a>
        .
      </p>
      <p className="mb-3">
        We aim to keep ad placements non-intrusive and consistent with the rest of the page content. We do not ask users to click ads,
        and we do not use deceptive labels or misleading layouts.
      </p>

      <h2 className="mt-6 text-2xl font-semibold">Local Storage</h2>
      <p className="mb-4">
        Tool inputs may be saved locally in your browser so you can resume work later. This storage stays on your device and can be cleared
        using your browser settings.
      </p>

      <h2 className="mt-6 text-2xl font-semibold">Your Choices</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>
          When you first visit, a cookie banner lets you accept or reject non-essential (advertising and
          analytics) cookies. Until you accept, these are set to a denied state using Google Consent Mode.
        </li>
        <li>You can change your choice at any time with the &ldquo;Cookie preferences&rdquo; link in the footer.</li>
        <li>You can block or clear cookies in your browser settings.</li>
        <li>You can clear local storage for DevBox from your browser to remove saved tool inputs.</li>
        <li>You can use ad blocking or privacy tools if you prefer not to see ads.</li>
      </ul>

      <h2 className="mt-6 text-2xl font-semibold">Contact</h2>
      <p>
        If you have any privacy questions, contact us at{" "}
        <Link to="/contact" className="text-blue-600 underline">
          the contact page
        </Link>
        .
      </p>
    </div>
  );
}
