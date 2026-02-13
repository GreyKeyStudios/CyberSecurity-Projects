"use client"

import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

interface MarkdownContentProps {
  content: string
  className?: string
}

const components: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "")
    const isInline = !match
    return !isInline && match ? (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        className="rounded-lg my-4"
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={`${className ?? ""} bg-muted px-1.5 py-0.5 rounded text-sm`} {...props}>
        {children}
      </code>
    )
  },
  img({ src, alt, ...props }) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt || ""}
        className="rounded-lg border border-border my-4 max-w-full h-auto"
        {...props}
      />
    )
  },
  a({ href, children, ...props }) {
    return (
      <a
        href={href}
        className="text-primary hover:underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    )
  },
}

export function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
