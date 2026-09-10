import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type HoverCardDescriptionProps = JSX.IntrinsicElements["p"]

export function HoverCardDescription(props: HoverCardDescriptionProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <p
      {...rest}
      data-slot="hover-card-description"
      class={cn("m-0 text-xs leading-6 text-muted-foreground", local.class)}
    >
      {local.children}
    </p>
  )
}
