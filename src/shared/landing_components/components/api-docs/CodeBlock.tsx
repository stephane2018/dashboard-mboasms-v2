"use client";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { useTheme } from 'next-themes';

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute right-2 top-2">
        <button
          onClick={handleCopy}
          className="p-2 rounded-md bg-muted/50 dark:bg-background/80 hover:bg-muted dark:hover:bg-background transition-colors"
          aria-label={copied ? "Copied" : "Copy to clipboard"}
        >
          {copied ? (
            <Check size={16} className="text-green-500" />
          ) : (
            <Copy size={16} className="text-muted-foreground" />
          )}
        </button>
      </div>
      <div className="rounded-md overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
        <SyntaxHighlighter
          language={language || 'javascript'}
          style={ vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            backgroundColor:  '#0f172a' ,
          }}
          codeTagProps={{
            style: {
              fontSize: 'inherit',
              lineHeight: 'inherit',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
