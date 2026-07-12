import PageMeta from "../components/PageMeta";

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-700 dark:text-gray-300 leading-relaxed">
      <PageMeta
        title="Contact DevBox"
        description="Contact DevBox for feedback, corrections, partnerships, or technical issues."
        canonicalPath="/contact"
      />

      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Contact</h1>
      <p className="mb-4">
        We welcome feedback, bug reports, content corrections, and ideas for new tools or guides.
      </p>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <p className="mb-2 font-semibold text-gray-900 dark:text-white">Email</p>
        <a href="mailto:service.devbox@gmail.com" className="text-blue-600 dark:text-blue-400 underline">
          service.devbox@gmail.com
        </a>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Typical topics: bug reports, new tool ideas, guide requests, and partnership inquiries.
        </p>
      </div>
    </div>
  );
}
