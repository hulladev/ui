import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type LinkCardDescriptionProps = JSX.IntrinsicElements["span"]

export function LinkCardDescription(props: LinkCardDescriptionProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <span
      {...rest}
      data-slot="link-card-description"
      class={cn("text-xs leading-5 text-muted-foreground", local.class)}
    >
      {local.children}
    </span>
  )
}
