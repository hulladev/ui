import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CodeBlockPathProps = JSX.IntrinsicElements["div"]

export function CodeBlockPath(props: CodeBlockPathProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <div
      {...rest}
      data-slot="code-block-path"
      class={cn(
        "flex min-h-8 min-w-0 items-center gap-3 border-b border-border bg-surface px-4 py-1.5 font-mono text-[0.6875rem] text-muted-foreground",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
