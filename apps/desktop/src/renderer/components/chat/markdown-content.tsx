import { memo, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";

function CodeBlock({ className, children }: { className?: string; children?: React.ReactNode }) {
  const [html, setHtml] = useState<string>("");
  const code = String(children).replace(/\n$/, "");
  const lang = className?.replace("language-", "") ?? "text";

  useEffect(() => {
    let cancelled = false;
    codeToHtml(code, {
      lang: lang as BundledLanguage,
      theme: "github-dark-default",
    })
      .then((result) => {
        if (!cancelled) setHtml(result);
      })
      .catch(() => {
        // Fallback: if shiki doesn't know the language, show as plain text
        if (!cancelled) setHtml("");
      });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  if (html) {
    return (
      <div
        className="my-2 overflow-x-auto rounded-sm text-callout [&_pre]:p-3"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <pre className="my-2 overflow-x-auto rounded-sm bg-secondary-background p-3 text-callout">
      <code>{code}</code>
    </pre>
  );
}

function InlineCode({ children }: { children?: React.ReactNode }) {
  return (
    <code className="rounded-xs bg-secondary-background px-1 py-0.5 text-callout">{children}</code>
  );
}

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent = memo(function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const isBlock = className?.startsWith("language-");
          if (isBlock) {
            return <CodeBlock className={className}>{children}</CodeBlock>;
          }
          return <InlineCode {...props}>{children}</InlineCode>;
        },
        p({ children }) {
          return <p className="my-1.5 first:mt-0 last:mb-0">{children}</p>;
        },
        ul({ children }) {
          return <ul className="my-1.5 list-disc pl-5">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="my-1.5 list-decimal pl-5">{children}</ol>;
        },
        li({ children }) {
          return <li className="my-0.5">{children}</li>;
        },
        strong({ children }) {
          return <strong className="font-semibold">{children}</strong>;
        },
        a({ href, children }) {
          return (
            <a href={href} className="text-accent underline" target="_blank" rel="noreferrer">
              {children}
            </a>
          );
        },
        blockquote({ children }) {
          return (
            <blockquote className="my-1.5 border-l-2 border-tertiary-label pl-3 text-secondary-label">
              {children}
            </blockquote>
          );
        },
        hr() {
          return <hr className="my-3 border-separator" />;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
});
