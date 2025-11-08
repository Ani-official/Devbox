import { Routes, Route } from "react-router-dom";
import WorkspaceTabs from "../components/WorkspaceTabs";
import JsonFormatter from "./tools/JsonFormatter";
import RegexTester from "./tools/RegexTester";
import CurlConverter from "./tools/CurlConverter";
import Base64Tool from "./tools/Base64Tool";
import ColorConverter from "./tools/ColorConverter";
import SvgOptimizer from "./tools/SvgOptimizer";
import JsonYamlConverter from "./tools/JsonYamlConverter";
import JwtDecoder from "./tools/JwtDecoder";

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
          <Route path="json-yaml-converter" element={<JsonYamlConverter />} />
          <Route path="jwt-decoder" element={<JwtDecoder />} />
        </Routes>
      </div>
    </div>
  );
}
