"use client";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Map display labels
  const langLabel: Record<string, string> = {
    bash: "cURL",
    javascript: "JavaScript",
    python: "Python",
    php: "PHP",
    json: "JSON",
    text: "CSV",
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-border/80 bg-[#0d1117]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-[10px] text-white/30 font-mono ml-2">
            {langLabel[language] || language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-white/40 hover:text-white/80 hover:bg-white/10 transition-all text-[10px] font-medium opacity-0 group-hover:opacity-100"
          aria-label={copied ? "Copied" : "Copy to clipboard"}
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={language || 'javascript'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem 1.25rem',
          fontSize: '0.8125rem',
          lineHeight: '1.6',
          backgroundColor: '#0d1117',
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
  );
}
