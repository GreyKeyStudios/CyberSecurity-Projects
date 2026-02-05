"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  return (
    <div className={`prose prose-invert max-w-none dark:prose-invert ${className}`}>
      <style jsx global>{`
        .prose {
          color: hsl(var(--muted-foreground));
        }
        .prose h1, .prose h2, .prose h3, .prose h4 {
          color: hsl(var(--foreground));
          font-weight: 600;
          margin-top: 2em;
          margin-bottom: 1em;
        }
        .prose h1 {
          font-size: 2.25em;
        }
        .prose h2 {
          font-size: 1.875em;
        }
        .prose h3 {
          font-size: 1.5em;
        }
        .prose code {
          background-color: hsl(var(--muted));
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }
        .prose pre {
          background-color: hsl(var(--muted));
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .prose pre code {
          background-color: transparent;
          padding: 0;
        }
        .prose a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }
        .prose a:hover {
          text-decoration: none;
        }
        .prose ul, .prose ol {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
        }
        .prose li {
          margin: 0.5rem 0;
        }
        .prose blockquote {
          border-left: 4px solid hsl(var(--primary));
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
        }
        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        .prose th, .prose td {
          border: 1px solid hsl(var(--border));
          padding: 0.5rem;
        }
        .prose th {
          background-color: hsl(var(--muted));
          font-weight: 600;
        }
      `}</style>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "")
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="rounded-lg my-4"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={`${className} bg-muted px-1.5 py-0.5 rounded text-sm`} {...props}>
                {children}
              </code>
            )
          },
          img({ node, ...props }: any) {
            return (
              <img
                {...props}
                className="rounded-lg border border-border my-4 max-w-full h-auto"
                alt={props.alt || ""}
              />
            )
          },
          a({ node, ...props }: any) {
            return (
              <a
                {...props}
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              />
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
