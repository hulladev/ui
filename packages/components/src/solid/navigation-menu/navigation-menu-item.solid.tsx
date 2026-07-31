import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type NavigationMenuItemProps = JSX.IntrinsicElements["li"] & {
  value?: string
}

export function NavigationMenuItem(props: NavigationMenuItemProps) {
  const [local, rest] = splitProps(props, ["children", "class", "value"])

  return (
    <li
      {...rest}
      data-slot="navigation-menu-item"
      data-state="closed"
      data-value={local.value}
      class={cn("contents", local.class)}
    >
      {local.children}
    </li>
  )
}
