import { Link } from "react-router-dom";
import PageMeta from "../components/PageMeta";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-700 dark:text-gray-300 leading-relaxed">
      <PageMeta
        title="Terms of Use | DevBox"
        description="Read the terms of use for DevBox, including acceptable use, content accuracy, and service limitations."
        canonicalPath="/terms"
      />

      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Terms of Use</h1>
      <p className="mb-4">Effective date: June 24, 2026</p>
      <p className="mb-4">
        These terms govern your use of DevBox. By using the site, you agree to use the tools responsibly and understand that the service is provided
        on an as-is basis for informational and productivity purposes.
      </p>

      <h2 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white mb-3">Acceptable Use</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Do not use the site to upload malware, abuse the service, or attempt to disrupt operation.</li>
        <li>Do not try to automate invalid traffic, ad abuse, or deceptive activity against the site or its ads.</li>
        <li>Use the tools for lawful development, debugging, and educational work.</li>
      </ul>

      <h2 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white mb-3">Service Limitations</h2>
      <p className="mb-4">
        DevBox is a free tool site. We may change features, remove tools, or update the site without notice.
        We do not guarantee uninterrupted availability, error-free output, or suitability for production-critical workflows.
      </p>

      <h2 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white mb-3">Intellectual Property</h2>
      <p className="mb-4">
        The DevBox brand, layout, and original written content are owned by DevBox unless otherwise noted.
        Third-party libraries and assets remain the property of their respective owners.
      </p>

      <h2 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white mb-3">Contact</h2>
      <p>
        Questions about these terms can be sent through{" "}
        <Link to="/contact" className="text-blue-600 dark:text-blue-400 underline">
          the contact page
        </Link>
        .
      </p>
    </div>
  );
}
