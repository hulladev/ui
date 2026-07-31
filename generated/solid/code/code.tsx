import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CodeProps = JSX.IntrinsicElements["code"]

export function Code(props: CodeProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <code
      {...rest}
      data-slot="code"
      class={cn(
        "rounded-sm border border-border bg-foreground/[0.045] px-1.5 py-0.5 font-mono text-[0.875em] font-medium text-foreground",
        local.class
      )}
    >
      {local.children}
    </code>
  )
}
