import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type FieldHeaderProps = JSX.IntrinsicElements["div"]

export function FieldHeader(props: FieldHeaderProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <div
      {...rest}
      data-slot="field-header"
      class={cn("flex min-w-0 items-baseline justify-between gap-3", local.class)}
    >
      {local.children}
    </div>
  )
}
