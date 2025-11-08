import { Braces, Regex, Terminal, Binary, Palette, Image } from "lucide-react";
import { motion } from "framer-motion";
import ToolBentoGrid from "../components/ToolBentoGrid";
import { Helmet } from "react-helmet-async";
import WhyDevBox from "../components/WhyDevbox";

type Tool = {
  title: string;
  desc: string;
  link: string;
  icon: any;
  size: "small" | "medium" | "large" | "wide";
  color: string;
};

export default function Home() {
  const tools: Tool[] = [
    {
      title: "JSON Formatter",
      desc: "Format, validate, and beautify JSON instantly with color-coded syntax.",
      link: "/workspace/json-formatter",
      icon: Braces,
      size: "large",
      color: "from-blue-500/10 to-blue-200/10",
    },
    {
      title: "JWT Decoder",
      desc: "Decode and verify JSON Web Tokens (JWT) with ease.",
      link: "/workspace/jwt-decoder",
      icon: Terminal,
      size: "small",
      color: "from-red-500/10 to-red-200/10",
    },
    {
      title: "Regex Tester",
      desc: "Visualize and debug regex patterns in real-time.",
      link: "/workspace/regex-tester",
      icon: Regex,
      size: "medium",
      color: "from-purple-500/10 to-purple-200/10",
    },
    {
      title: "cURL Converter",
      desc: "Turn cURL commands into clean Fetch or Axios snippets.",
      link: "/workspace/curl-converter",
      icon: Terminal,
      size: "medium",
      color: "from-green-500/10 to-green-200/10",
    },
    {
      title: "Base64 Tool",
      desc: "Encode and decode Base64 easily — secure and fast.",
      link: "/workspace/base64-tool",
      icon: Binary,
      size: "small",
      color: "from-orange-500/10 to-orange-200/10",
    },
    {
      title: "Color Converter",
      desc: "Switch between HEX, RGB, HSL formats instantly.",
      link: "/workspace/color-converter",
      icon: Palette,
      size: "small",
      color: "from-pink-500/10 to-pink-200/10",
    },
    {
      title: "JSON ⇄ YAML Converter",
      desc: "Convert structured JSON data into clean, readable YAML format instantly - simple and accurate.",
      link: "/workspace/json-yaml-converter",
      icon: Braces,
      size: "wide",
      color: "from-lime-500/10 to-lime-200/10",
    },
    {
      title: "SVG Optimizer",
      desc: "Minify and clean SVG code while keeping vector quality intact.",
      link: "/workspace/svg-optimizer",
      icon: Image,
      size: "medium",
      color: "from-cyan-500/10 to-cyan-200/10",
    },
    
  ];

  return (
    <main className="min-h-screen  flex flex-col items-center justify-start py-16 px-6">
      <Helmet>
        <title>DevBox — Online Developer Toolbox</title>
        <meta
          name="description"
          content="DevBox is your all-in-one online developer toolbox — JSON Formatter, Regex Tester, cURL Converter, Color Converter, and more."
        />
      </Helmet>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16 max-w-3xl"
      >
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white font-anton">
          All Your Developer Tools,{" "}
          <span className="text-blue-700 dark:text-blue-400">Unified</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mt-4">
          DevBox brings together essential developer utilities — JSON, regex,
          color, and more — in a single, beautifully crafted workspace.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <ToolBentoGrid tools={tools} />
      <div className="mt-5 md:w-full">
      <WhyDevBox />
      </div>
    </main>
  );
}
