import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type HoverCardTitleProps = JSX.IntrinsicElements["strong"]

export function HoverCardTitle(props: HoverCardTitleProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <strong
      {...rest}
      data-slot="hover-card-title"
      class={cn("block text-base font-semibold", local.class)}
    >
      {local.children}
    </strong>
  )
}
