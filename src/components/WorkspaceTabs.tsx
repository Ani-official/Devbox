import { NavLink } from "react-router-dom";

export default function WorkspaceTabs() {
  const tabs = [
    { name: "JSON Formatter", path: "json-formatter" },
    { name: "Regex Tester", path: "regex-tester" },
    { name: "cURL Converter", path: "curl-converter" },
    { name: "Base64 Tool", path: "base64-tool" },
    { name: "Color Converter", path: "color-converter" },
    { name: "SVG Optimizer", path: "svg-optimizer" },
    { name: "JSON/YAML Converter", path: "json-yaml-converter" },
    { name: "JWT Decoder", path: "jwt-decoder" },
  ];

  return (
    <div className="max-w-6xl mx-auto flex gap-3 border-b mb-4 overflow-x-auto">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={`/workspace/${tab.path}`}
          className={({ isActive }) =>
            `px-3 py-2 text-sm font-medium rounded-t-md ${
              isActive
                ? "bg-blue-800 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          {tab.name}
        </NavLink>
      ))}
    </div>
  );
}
