import { Link } from "react-router-dom";
import { openConsentSettings } from "../lib/consent";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white/85 py-6 mt-10 text-sm text-slate-600 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
      <div className="max-w-6xl mx-auto flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-left">
          <div className="font-semibold text-slate-900 dark:text-white">DevBox</div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Browser-based tools and guides for developers.
          </p>
        </div>

        <span className="text-center text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} DevBox. All rights reserved.
        </span>

        <ul className="flex flex-wrap justify-center gap-4 sm:justify-end">
          <li>
            <Link to="/about" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              About
            </Link>
          </li>
          <li>
            <Link to="/editorial-policy" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Editorial Policy
            </Link>
          </li>
          <li>
            <Link to="/privacy-policy" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link to="/terms" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Terms
            </Link>
          </li>
          <li>
            <Link to="/contact" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Contact
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={openConsentSettings}
              className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
            >
              Cookie preferences
            </button>
          </li>
        </ul>
      </div>
    </footer>
  );
}
