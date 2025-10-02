import { Routes, Route } from "react-router-dom";
import WorkspaceTabs from "../components/WorkspaceTabs";
import JsonFormatter from "./tools/JsonFormatter";
import RegexTester from "./tools/RegexTester";
import CurlConverter from "./tools/CurlConverter";
import Base64Tool from "./tools/Base64Tool";
import ColorConverter from "./tools/ColorConverter";
import SvgOptimizer from "./tools/SvgOptimizer";

export default function Workspace() {
  return (
    <div>
      <WorkspaceTabs />
      <div className="mt-4">
        <Routes>
          <Route path="json-formatter" element={<JsonFormatter />} />
          <Route path="regex-tester" element={<RegexTester />} />
          <Route path="curl-converter" element={<CurlConverter />} />
          <Route path="base64-tool" element={<Base64Tool />} />
          <Route path="color-converter" element={<ColorConverter />} />
          <Route path="svg-optimizer" element={<SvgOptimizer />} />

        </Routes>
      </div>
    </div>
  );
}
