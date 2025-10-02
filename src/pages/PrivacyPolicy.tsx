import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Helmet>
        <title>Privacy Policy | DevBox</title>
        <meta
          name="description"
          content="Read DevBox's Privacy Policy. Learn how we collect, use, and protect your data while using our free online developer tools."
        />
        <meta property="og:title" content="Privacy Policy | DevBox" />
        <meta
          property="og:description"
          content="DevBox's privacy practices for users of our online developer tools, including data collection, cookies, and Google AdSense usage."
        />
      </Helmet>

      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p>Effective date: October 2025</p>

      <p>
        DevBox ("we", "our", or "us") operates the website{" "}
        <strong>devbox-gamma.vercel.app</strong>. Your privacy is important to us. 
        This Privacy Policy explains what information we collect, how we use it, and your choices.
      </p>

      <h2 className="mt-4 text-2xl font-semibold">Information We Collect</h2>
      <ul className="list-disc ml-6">
        <li>Automatically collected information: browser type, IP address, usage data for analytics and ads.</li>
        <li>Cookies & local storage: used to save tool input, preferences, and improve user experience.</li>
      </ul>

      <h2 className="mt-4 text-2xl font-semibold">How We Use Information</h2>
      <ul className="list-disc ml-6">
        <li>To provide and improve our developer tools.</li>
        <li>To personalize content and show relevant ads (via Google AdSense).</li>
        <li>For analytics to understand user engagement and improve functionality.</li>
      </ul>

      <h2 className="mt-4 text-2xl font-semibold">Third-Party Services</h2>
      <p>
        We use Google AdSense for monetization, which may use cookies and tracking technologies. 
        Learn more at{" "}
        <a href="https://policies.google.com/technologies/ads" target="_blank" className="text-blue-600 underline">
          Google Ads Privacy
        </a>.
      </p>

      <h2 className="mt-4 text-2xl font-semibold">Your Choices</h2>
      <p>
        You can clear your browser cookies or use ad-blockers to limit tracking. 
        Your local storage inputs are controlled only by you.
      </p>

      <h2 className="mt-4 text-2xl font-semibold">Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at{" "}
        <a href="mailto:service.devbox@gmail.com" className="text-blue-600 underline">
          service.devbox@gmail.com
        </a>.
      </p>
    </div>
  );
}
