import { useState } from "react";
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

export default function CodeEditor({ value, onChange, readOnly, language="json" }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleEditorChange: OnChange = (val) => {
    onChange(val || "");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative">
      {/* Copy button (top-right corner) */}
      <button
        onClick={handleCopy}
        className="absolute top-1 right-5 z-10 bg-gray-900 text-white p-1 rounded hover:bg-gray-700"
      >
        {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
      </button>

      {/* Monaco Editor */}
      <Editor
        height="300px"
        defaultLanguage={language}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          readOnly: readOnly ?? false,
          minimap: { enabled: false },
          scrollbar: {vertical: "auto", horizontal: "auto",alwaysConsumeMouseWheel: false},
                        
          fontSize: 14,
          wordWrap: "on",
          scrollBeyondLastLine: false,
        }}
        
      />
    </div>
  );
}
