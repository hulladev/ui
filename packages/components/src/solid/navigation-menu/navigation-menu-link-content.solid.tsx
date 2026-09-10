import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type NavigationMenuLinkContentProps = JSX.IntrinsicElements["span"]

export function NavigationMenuLinkContent(props: NavigationMenuLinkContentProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <span
      {...rest}
      data-slot="navigation-menu-link-content"
      class={cn("grid min-w-0 gap-0.5", local.class)}
    >
      {local.children}
    </span>
  )
}
