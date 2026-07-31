import { cn } from "@/lib/style"
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from "react"
import {
  includesLine,
  plainHighlightedCode,
  type HighlightedCode,
  type HighlightedToken,
} from "./code-highlight"

export type CodeBlockContentProps = Omit<ComponentPropsWithRef<"pre">, "children"> & {
  children?: ReactNode
  code?: string
  deletedLines?: readonly number[]
  errorLines?: readonly number[]
  focusedLines?: readonly number[]
  highlighted?: HighlightedCode
  highlightedLines?: readonly number[]
  insertedLines?: readonly number[]
  language?: string
  lineNumbers?: boolean
  startLine?: number
  warningLines?: readonly number[]
  wrap?: boolean
}

function tokenStyle(token: HighlightedToken): CSSProperties {
  return {
    color: token.color,
    fontStyle: token.fontStyle,
    fontWeight: token.fontWeight,
    textDecoration: token.textDecoration,
  }
}

export function CodeBlockContent({
  children,
  className,
  code,
  deletedLines,
  errorLines,
  focusedLines,
  highlighted,
  highlightedLines,
  insertedLines,
  language,
  lineNumbers = false,
  startLine = 1,
  tabIndex = 0,
  warningLines,
  wrap = false,
  ...props
}: CodeBlockContentProps) {
  const result =
    highlighted ?? (code !== undefined ? plainHighlightedCode(code, language) : undefined)

  return (
    <pre
      {...props}
      tabIndex={tabIndex}
      data-language={language ?? result?.language}
      data-line-numbers={lineNumbers || undefined}
      data-slot="code-block-content"
      data-wrap={wrap || undefined}
      className={cn(
        "group/code-content m-0 min-w-0 overflow-auto bg-[var(--hulla-code-background)] py-4 font-mono text-[0.8125rem] leading-6 text-[var(--hulla-code-foreground)] [tab-size:2] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring",
        wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
        className
      )}
    >
      <code data-slot="code-block-code">
        {result
          ? result.lines.map((sourceLine, index) => {
              const line = startLine + index
              const isHighlighted = sourceLine.highlighted || includesLine(highlightedLines, line)
              const isInserted = sourceLine.inserted || includesLine(insertedLines, line)
              const isDeleted = sourceLine.deleted || includesLine(deletedLines, line)
              const isFocused = sourceLine.focused || includesLine(focusedLines, line)
              const isError = sourceLine.error || includesLine(errorLines, line)
              const isWarning = sourceLine.warning || includesLine(warningLines, line)

              return (
                <span key={line}>
                  <span
                    data-code-line=""
                    data-line={line}
                    data-highlighted={isHighlighted || undefined}
                    data-inserted={isInserted || undefined}
                    data-deleted={isDeleted || undefined}
                    data-focused={isFocused || undefined}
                    data-error={isError || undefined}
                    data-warning={isWarning || undefined}
                    className="relative inline-block min-h-6 min-w-full border-l-2 border-transparent px-4 data-[highlighted]:border-primary data-[highlighted]:bg-primary/10 data-[inserted]:border-success data-[inserted]:bg-success/10 data-[deleted]:border-danger data-[deleted]:bg-danger/10 data-[error]:border-danger data-[error]:bg-danger/10 data-[warning]:border-warning data-[warning]:bg-warning/10 group-has-[[data-focused]]/code-content:opacity-45 group-has-[[data-focused]]/code-content:data-[focused]:opacity-100"
                  >
                    {sourceLine.tokens.map((token, tokenIndex) => (
                      <span
                        key={`${line}-${tokenIndex}`}
                        className={token.className}
                        style={tokenStyle(token)}
                      >
                        {token.content}
                      </span>
                    ))}
                  </span>
                  {index < result.lines.length - 1 ? "\n" : null}
                </span>
              )
            })
          : children}
      </code>
    </pre>
  )
}
