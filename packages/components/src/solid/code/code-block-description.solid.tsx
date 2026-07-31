import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CodeBlockDescriptionProps = JSX.IntrinsicElements["div"]

export function CodeBlockDescription(props: CodeBlockDescriptionProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <div
      {...rest}
      data-slot="code-block-description"
      class={cn("min-w-0 text-xs leading-5 text-muted-foreground", local.class)}
    >
      {local.children}
    </div>
  )
}
