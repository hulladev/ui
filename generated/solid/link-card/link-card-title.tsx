import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type LinkCardTitleProps = JSX.IntrinsicElements["strong"]

export function LinkCardTitle(props: LinkCardTitleProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <strong
      {...rest}
      data-slot="link-card-title"
      class={cn("text-sm font-medium tracking-[-0.015em]", local.class)}
    >
      {local.children}
    </strong>
  )
}
