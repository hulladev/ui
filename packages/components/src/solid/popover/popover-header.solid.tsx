import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type PopoverHeaderProps = JSX.IntrinsicElements["div"]

export function PopoverHeader(props: PopoverHeaderProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <div
      {...rest}
      data-slot="popover-header"
      class={cn("flex items-center gap-2.5 p-2.5", local.class)}
    >
      {local.children}
    </div>
  )
}
