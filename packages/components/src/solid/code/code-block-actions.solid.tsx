import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CodeBlockActionsProps = JSX.IntrinsicElements["div"]

export function CodeBlockActions(props: CodeBlockActionsProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <div
      {...rest}
      data-slot="code-block-actions"
      class={cn("ml-auto flex shrink-0 items-center gap-1.5", local.class)}
    >
      {local.children}
    </div>
  )
}
