import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CodeBlockProps = JSX.IntrinsicElements["div"]

export function CodeBlock(props: CodeBlockProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <div
      {...rest}
      data-slot="code-block"
      class={cn(
        "group/code-block min-w-0 overflow-hidden rounded-md border border-border bg-surface-raised text-foreground shadow-sm",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
