import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white dark:bg-gray-900 py-6 mt-8 text-gray-600 dark:text-gray-300 text-sm">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        {/* Left spacer */}
        <div className="flex-1"></div>

        {/* Centered copyright */}
        <span className="flex-1 text-center">
          © {new Date().getFullYear()} DevBox. All rights reserved.
        </span>

        {/* Right-aligned links */}
        <ul className="flex flex-1 justify-end gap-4 mt-2 sm:mt-0">
          <li>
            <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400">
              About
            </Link>
          </li>
          <li>
            <Link to="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400">
              Privacy Policy
            </Link>
          </li>
          <li>
            <a
              href="mailto:service.devbox@gmail.com"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
