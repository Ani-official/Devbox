import { useEffect, useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
import type { OnChange } from "@monaco-editor/react";
import { Copy, Check } from "lucide-react";

// Configure worker path
loader.config({ paths: { vs: "https://unpkg.com/monaco-editor@0.44.0/min/vs" } });

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  language?: string;
}

// Track the site's light/dark theme (the `.dark` class on <html>) so the editor
// theme matches the page instead of always rendering dark.
function useIsDark() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

export default function CodeEditor({ value, onChange, readOnly, language = "json" }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  // Monaco relies on the DOM, so only render it after mount. During static
  // prerendering (and the first client render) we show a matching placeholder
  // to avoid touching `window`/`document` on the server and prevent layout shift.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = useIsDark();

  const handleEditorChange: OnChange = (val) => {
    onChange(val || "");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const surface = isDark ? "bg-[#1e1e1e]" : "bg-white";

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
      {/* Copy button (top-right corner) */}
      <button
        onClick={handleCopy}
        aria-label={copied ? "Copied!" : "Copy to clipboard"}
        title={copied ? "Copied!" : "Copy to clipboard"}
        className="absolute top-2 right-3 z-10 rounded-md bg-slate-900/90 p-1.5 text-white shadow-sm transition-colors hover:bg-slate-700"
      >
        {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
      </button>

      {/* Monaco Editor (client-only, theme-aware) */}
      {mounted ? (
        <Editor
          height="300px"
          defaultLanguage={language}
          value={value}
          onChange={handleEditorChange}
          theme={isDark ? "vs-dark" : "vs"}
          loading={
            <div className={`flex h-[300px] w-full items-center justify-center ${surface}`}>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                Loading editor…
              </div>
            </div>
          }
          options={{
            readOnly: readOnly ?? false,
            minimap: { enabled: false },
            scrollbar: { vertical: "auto", horizontal: "auto", alwaysConsumeMouseWheel: false },
            fontSize: 14,
            wordWrap: "on",
            padding: { top: 12, bottom: 12 },
            scrollBeyondLastLine: false,
          }}
        />
      ) : (
        <div className={`h-[300px] w-full ${surface}`} aria-hidden="true" />
      )}
    </div>
  );
}
