import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type NavigationMenuLinkTitleProps = JSX.IntrinsicElements["strong"]

export function NavigationMenuLinkTitle(props: NavigationMenuLinkTitleProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <strong
      {...rest}
      data-slot="navigation-menu-link-title"
      class={cn("text-sm font-medium tracking-[-0.015em]", local.class)}
    >
      {local.children}
    </strong>
  )
}
