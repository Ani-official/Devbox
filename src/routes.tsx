import { Navigate } from "react-router-dom";
import type { RouteRecord } from "vite-react-ssg";

import App from "./App";
import Home from "./routes/Home";
import Workspace from "./routes/Workspace";
import About from "./routes/About";
import PrivacyPolicy from "./routes/PrivacyPolicy";
import Terms from "./routes/Terms";
import Contact from "./routes/Contact";
import EditorialPolicy from "./routes/EditorialPolicy";
import GuidesIndex from "./routes/guides/GuidesIndex";
import JsonFormattingGuide from "./routes/guides/JsonFormattingGuide";
import RegexGuide from "./routes/guides/RegexGuide";
import CurlToFetchGuide from "./routes/guides/CurlToFetchGuide";
import JwtDecodingGuide from "./routes/guides/JwtDecodingGuide";
import Base64Guide from "./routes/guides/Base64Guide";
import ColorFormatsGuide from "./routes/guides/ColorFormatsGuide";
import JsonYamlGuide from "./routes/guides/JsonYamlGuide";
import SvgOptimizationGuide from "./routes/guides/SvgOptimizationGuide";

import JsonFormatter from "./routes/tools/JsonFormatter";
import RegexTester from "./routes/tools/RegexTester";
import CurlConverter from "./routes/tools/CurlConverter";
import Base64Tool from "./routes/tools/Base64Tool";
import ColorConverter from "./routes/tools/ColorConverter";
import SvgOptimizer from "./routes/tools/SvgOptimizer";
import JsonYamlConverter from "./routes/tools/JsonYamlConverter";
import JwtDecoder from "./routes/tools/JwtDecoder";

// Route components are imported eagerly (not React.lazy) so that static
// prerendering renders the full page content for every route, instead of a
// Suspense fallback. This is what lets crawlers (and AdSense) see real HTML.
export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "terms", element: <Terms /> },
      { path: "contact", element: <Contact /> },
      { path: "editorial-policy", element: <EditorialPolicy /> },
      { path: "guides", element: <GuidesIndex /> },
      { path: "guides/json-formatting", element: <JsonFormattingGuide /> },
      { path: "guides/regex-testing", element: <RegexGuide /> },
      { path: "guides/curl-to-fetch", element: <CurlToFetchGuide /> },
      { path: "guides/jwt-decoding", element: <JwtDecodingGuide /> },
      { path: "guides/base64-encoding", element: <Base64Guide /> },
      { path: "guides/color-formats", element: <ColorFormatsGuide /> },
      { path: "guides/json-yaml", element: <JsonYamlGuide /> },
      { path: "guides/svg-optimization", element: <SvgOptimizationGuide /> },
      {
        path: "workspace",
        element: <Workspace />,
        children: [
          {
            index: true,
            element: <Navigate to="/workspace/json-formatter" replace />,
          },
          { path: "json-formatter", element: <JsonFormatter /> },
          { path: "regex-tester", element: <RegexTester /> },
          { path: "curl-converter", element: <CurlConverter /> },
          { path: "base64-tool", element: <Base64Tool /> },
          { path: "color-converter", element: <ColorConverter /> },
          { path: "svg-optimizer", element: <SvgOptimizer /> },
          { path: "json-yaml-converter", element: <JsonYamlConverter /> },
          { path: "jwt-decoder", element: <JwtDecoder /> },
        ],
      },
    ],
  },
];
