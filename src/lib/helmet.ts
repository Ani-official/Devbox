// react-helmet-async must stay a single, externalized module instance so its
// <Helmet> tags are collected by the <HelmetProvider> that vite-react-ssg wraps
// the app in during static prerendering. But the package resolves differently
// per environment: the bundler picks its ESM build (named exports, no default),
// while Node's SSR loader picks its CommonJS build (default export only, and
// `Helmet` is NOT synthesizable as a named ESM import). A namespace import works
// in both cases without throwing, and we read whichever shape is present.
import * as ReactHelmetAsync from "react-helmet-async";

type HelmetModule = {
  Helmet: typeof import("react-helmet-async").Helmet;
  default?: { Helmet: typeof import("react-helmet-async").Helmet };
};

const helmet = ReactHelmetAsync as unknown as HelmetModule;

export const Helmet = helmet.Helmet ?? helmet.default!.Helmet;
