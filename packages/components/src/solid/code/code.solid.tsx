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
        "box-decoration-clone rounded-[0.25em] bg-foreground/5 px-[0.25em] py-[0.125em] font-mono text-[0.875em] leading-[inherit] font-normal text-foreground [overflow-wrap:anywhere]",
        local.class
      )}
    >
      {local.children}
    </code>
  )
}
