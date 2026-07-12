import { Link } from "react-router-dom";
import PageMeta from "../components/PageMeta";

export default function EditorialPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-700 dark:text-gray-300 leading-relaxed">
      <PageMeta
        title="Editorial Policy | DevBox"
        description="Learn how DevBox creates, reviews, and maintains its tool pages and guides."
        canonicalPath="/editorial-policy"
      />

      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Editorial Policy</h1>
      <p className="mb-4">
        DevBox publishes practical developer content that is intended to be accurate, useful, and easy to verify.
        Every page is written to help a real user complete a specific task, with examples they can follow directly.
      </p>

      <h2 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white mb-3">How Content Is Created</h2>
      <ul className="list-disc ml-6 space-y-2">
        <li>Tool pages start with a real user workflow, not a keyword list.</li>
        <li>Guides include examples, context, and practical troubleshooting tips.</li>
        <li>Content is reviewed for clarity, accuracy, and usefulness before publishing.</li>
      </ul>

      <h2 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white mb-3">How Content Is Updated</h2>
      <p className="mb-4">
        When a tool changes, the corresponding page, metadata, and internal links should be updated together.
        We also revise content that becomes outdated or no longer reflects current browser behavior or developer expectations.
      </p>

      <h2 className="mt-6 text-2xl font-semibold text-gray-900 dark:text-white mb-3">Corrections</h2>
      <p>
        If you spot an error, please send a correction request through{" "}
        <Link to="/contact" className="text-blue-600 dark:text-blue-400 underline">
          the contact page
        </Link>
        .
      </p>
    </div>
  );
}
