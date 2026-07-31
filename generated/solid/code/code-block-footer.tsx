import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CodeBlockFooterProps = JSX.IntrinsicElements["div"]

export function CodeBlockFooter(props: CodeBlockFooterProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <div
      {...rest}
      data-slot="code-block-footer"
      class={cn(
        "flex min-h-10 min-w-0 items-center gap-3 border-t border-border bg-surface px-4 py-2 text-xs text-muted-foreground",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
