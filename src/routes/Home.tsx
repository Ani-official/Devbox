import { Braces, Regex, Terminal, Binary, Palette, Image } from "lucide-react";
import ToolCard from "../components/ToolCard";

export default function Home() {
  const tools = [
    { title: "JSON Formatter", desc: "Format, validate, and beautify JSON instantly.", link: "/workspace/json-formatter", icon: <Braces /> },
    { title: "Regex Tester", desc: "Test, debug, and visualize regex matches in real-time.", link: "/workspace/regex-tester", icon: <Regex /> },
    { title: "cURL Converter", desc: "Convert cURL commands to Fetch or Axios code easily.", link: "/workspace/curl-converter", icon: <Terminal /> },
    { title: "Base64 Tool", desc: "Encode and decode Base64 strings quickly and safely.", link: "/workspace/base64-tool", icon: <Binary /> },
    { title: "Color Converter", desc: "Convert between HEX, RGB, HSL, and other color formats.", link: "/workspace/color-converter", icon: <Palette /> },
    { title: "SVG Optimizer", desc: "Minify and optimize SVG files for better performance.", link: "/workspace/svg-optimizer", icon: <Image /> },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-bold">Welcome to <span className="text-blue-800">DevBox</span></h1>
      <p className="text-gray-600 mt-2">Your all-in-one developer toolbox 🚀</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full max-w-6xl">
        {tools.map((tool) => (
          <ToolCard
            key={tool.title}
            title={tool.title}
            description={tool.desc}
            link={tool.link}
            icon={tool.icon}
          />
        ))}
      </div>
    </div>
  );
}
