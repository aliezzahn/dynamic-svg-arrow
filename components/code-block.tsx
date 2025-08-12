"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism, dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import tsx from "react-syntax-highlighter/dist/esm/languages/prism/tsx";
import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import js from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import jsx from "react-syntax-highlighter/dist/esm/languages/prism/jsx";
import html from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import { useTheme } from "next-themes";

SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("ts", ts);
SyntaxHighlighter.registerLanguage("js", js);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("html", html);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("bash", bash);

type CodeBlockProps = {
  code: string;
  language?:
    | "tsx"
    | "ts"
    | "js"
    | "jsx"
    | "html"
    | "css"
    | "json"
    | "bash"
    | string;
  filename?: string;
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  highlightLines?: number[]; // 1-based
  wrap?: boolean;
};

export function CodeBlock({
  code,
  language = "tsx",
  filename,
  showLineNumbers = true,
  startingLineNumber = 1,
  highlightLines,
  wrap = false,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const { theme } = useTheme();

  const cleanedCode = React.useMemo(() => {
    const normalized = code.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    return normalized.endsWith("\n") ? normalized.slice(0, -1) : normalized;
  }, [code]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <div className="group rounded-lg border bg-card text-card-foreground overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b bg-gradient-to-r from-slate-50/40 via-background to-slate-50/40 dark:from-slate-900/40 dark:via-background dark:to-slate-900/40">
        <div className="min-w-0 flex items-center gap-2">
          {filename ? (
            <span className="truncate text-xs font-medium text-foreground/90">
              {filename}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">Code</span>
          )}
          <span className="text-[10px] rounded px-1.5 py-0.5 border text-muted-foreground">
            {language.toUpperCase()}
          </span>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCopy}
            className="h-8 gap-1 bg-transparent"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {copied ? "Copied" : "Copy"}
            </span>
          </Button>
        </div>
      </div>

      <div className="relative overflow-auto">
        <SyntaxHighlighter
          language={language}
          style={theme === "light" ? prism : dracula}
          showLineNumbers={showLineNumbers}
          startingLineNumber={startingLineNumber}
          wrapLines={!!highlightLines?.length}
          lineProps={(lineNumber) => {
            const isHighlighted = highlightLines?.includes(lineNumber) ?? false;
            return isHighlighted
              ? {
                  className:
                    theme === "light" ? "bg-primary/10" : "bg-primary/20",
                }
              : {};
          }}
          customStyle={{
            margin: 0,
            padding: "0.375rem 1rem",
            background: "transparent",
            whiteSpace: wrap ? "pre-wrap" : "pre",
            wordBreak: wrap ? "break-word" : "normal",
          }}
          codeTagProps={{ className: "text-sm font-mono" }}
        >
          {cleanedCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
