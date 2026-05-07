import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import WorkspaceTabs from "../components/WorkspaceTabs";

const JsonFormatter = lazy(() => import("./tools/JsonFormatter"));
const RegexTester = lazy(() => import("./tools/RegexTester"));
const CurlConverter = lazy(() => import("./tools/CurlConverter"));
const Base64Tool = lazy(() => import("./tools/Base64Tool"));
const ColorConverter = lazy(() => import("./tools/ColorConverter"));
const SvgOptimizer = lazy(() => import("./tools/SvgOptimizer"));
const JsonYamlConverter = lazy(() => import("./tools/JsonYamlConverter"));
const JwtDecoder = lazy(() => import("./tools/JwtDecoder"));

function ToolFallback() {
  return (
    <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading tool…</span>
      </div>
    </div>
  );
}

export default function Workspace() {
  return (
    <div>
      <WorkspaceTabs />
      <div className="mt-4">
        <Suspense fallback={<ToolFallback />}>
          <Routes>
            <Route index element={<Navigate to="json-formatter" replace />} />
            <Route path="json-formatter" element={<JsonFormatter />} />
            <Route path="regex-tester" element={<RegexTester />} />
            <Route path="curl-converter" element={<CurlConverter />} />
            <Route path="base64-tool" element={<Base64Tool />} />
            <Route path="color-converter" element={<ColorConverter />} />
            <Route path="svg-optimizer" element={<SvgOptimizer />} />
            <Route path="json-yaml-converter" element={<JsonYamlConverter />} />
            <Route path="jwt-decoder" element={<JwtDecoder />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}
