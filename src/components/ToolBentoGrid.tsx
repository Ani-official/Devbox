import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import CodeEditor from "../components/Editor"; // adjust path

interface Tool {
  title: string;
  desc: string;
  link: string;
  icon: any;
  size: "small" | "medium" | "large" | "wide";
  color: string;
}

export default function ToolBentoGrid({ tools }: { tools: Tool[] }) {
  const [jsonInput, setJsonInput] = useState(`{
  "name": "DevBox",
  "type": "Utility Tool",
  "features": ["JSON Formatter", "Regex Tester", "SVG Optimizer","cURL Converter", "Base64 Tool", "Color Converter"],
  "website": "https://devbox-gamma.vercel.app",
  "license": "MIT"
}`);

  return (
    <section
      className="w-full max-w-6xl grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[200px] md:auto-rows-[240px]"
      aria-label="Developer tools showcase"
    >
      {tools.map((tool) => {
        const Icon = tool.icon;
        const spanClass =
          tool.size === "large"
            ? "md:col-span-2 md:row-span-2"
            : tool.size === "wide"
            ? "md:col-span-2"
            : "md:col-span-1";

        const isJsonFormatter = tool.title.toLowerCase().includes("json formatter");

        return (
          <motion.article
            key={tool.title}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${tool.color} 
            border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-500 ${spanClass}`}
          >
            <div className="flex flex-col h-full p-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/70 dark:bg-gray-800/60 text-blue-700 dark:text-blue-400 backdrop-blur-sm">
                  <Icon size={26} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {tool.title}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-3">
                {tool.desc}
              </p>

              {isJsonFormatter && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-700">
                  <CodeEditor
                    value={jsonInput}
                    onChange={setJsonInput}
                    readOnly={true}
                    language="json"
                  />
                </div>
              )}

              <Link
                to={tool.link}
                className="mt-4 text-blue-700 dark:text-blue-400 text-sm font-medium hover:underline"
              >
                Open Tool →
              </Link>
            </div>
          </motion.article>
        );
      })}
    </section>
  );
}
