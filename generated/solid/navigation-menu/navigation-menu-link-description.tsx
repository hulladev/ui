import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type NavigationMenuLinkDescriptionProps = JSX.IntrinsicElements["span"]

export function NavigationMenuLinkDescription(props: NavigationMenuLinkDescriptionProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <span
      {...rest}
      data-slot="navigation-menu-link-description"
      class={cn("text-xs leading-5 text-muted-foreground", local.class)}
    >
      {local.children}
    </span>
  )
}
