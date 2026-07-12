import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes";
import "./index.css";

// ViteReactSSG sets up the router (createBrowserRouter), HelmetProvider, and
// client hydration for us. On the client it hydrates the prerendered HTML; at
// build time it renders each route to a static .html file.
export const createRoot = ViteReactSSG({ routes });
