import { Helmet } from "react-helmet-async";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Helmet>
        <title>About DevBox | Free Developer Tools</title>
        <meta
          name="description"
          content="Learn about DevBox, your free all-in-one developer toolbox with tools like JSON Formatter, Regex Tester, Base64 Tool, and more."
        />
        <meta property="og:title" content="About DevBox | Free Developer Tools" />
        <meta
          property="og:description"
          content="DevBox provides free web tools for developers: JSON formatting, regex testing, color conversion, and more."
        />
      </Helmet>

      <h1 className="text-3xl font-bold mb-4">About DevBox</h1>
      <p className="mb-4">
        DevBox is a free, all-in-one developer toolbox designed to help you work faster and smarter. 
        From JSON formatting to regex testing, color conversion, and more, DevBox provides simple, fast, and reliable web tools for developers.
      </p>
      <p>
        Our mission is to make everyday developer tasks easier by providing accessible, no-login, web-based tools that you can use anytime, anywhere.
      </p>

      <h2 className="mt-6 text-2xl font-semibold">Contact</h2>
      <p>
        If you have any suggestions or questions, reach out to us at{" "}
        <a href="mailto:service.devbox@gmail.com" className="text-blue-600 underline">
          service.devbox@gmail.com
        </a>.
      </p>
    </div>
  );
}
