import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type TagInputLabelProps = JSX.IntrinsicElements["span"]

export function TagInputLabel(props: TagInputLabelProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <span {...rest} data-slot="tag-input-label" class={cn("min-w-0 truncate", local.class)}>
      {local.children}
    </span>
  )
}
