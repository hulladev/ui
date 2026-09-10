import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type FieldContentProps = JSX.IntrinsicElements["div"]

export function FieldContent(props: FieldContentProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <div {...rest} data-slot="field-content" class={cn("grid min-w-0 gap-0.5", local.class)}>
      {local.children}
    </div>
  )
}
