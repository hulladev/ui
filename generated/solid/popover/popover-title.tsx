import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type PopoverTitleProps = JSX.IntrinsicElements["strong"]

export function PopoverTitle(props: PopoverTitleProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <strong
      {...rest}
      data-slot="popover-title"
      class={cn("block text-sm font-semibold", local.class)}
    >
      {local.children}
    </strong>
  )
}
