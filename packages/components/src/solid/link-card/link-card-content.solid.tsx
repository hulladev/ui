import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type LinkCardContentProps = JSX.IntrinsicElements["span"]

export function LinkCardContent(props: LinkCardContentProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <span {...rest} data-slot="link-card-content" class={cn("grid min-w-0 gap-0.5", local.class)}>
      {local.children}
    </span>
  )
}
