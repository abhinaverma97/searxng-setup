import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = "bash", className = "" }: CodeBlockProps) {
  return (
    <div className={`text-xs max-h-48 overflow-y-auto ${className}`}>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1rem",
          borderRadius: 0,
          background: "rgba(255,255,255,0.03)",
          fontSize: "0.75rem",
          lineHeight: "1.5",
        }}
        codeTagProps={{ style: { fontFamily: "inherit" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
