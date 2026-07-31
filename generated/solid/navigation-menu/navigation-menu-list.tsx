import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type NavigationMenuListProps = JSX.IntrinsicElements["ul"]

export function NavigationMenuList(props: NavigationMenuListProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <ul
      {...rest}
      data-slot="navigation-menu-list"
      class={cn(
        "m-0 flex min-w-0 flex-wrap items-center gap-0.5 rounded-lg bg-surface/72 p-1 shadow-xs ring-1 ring-border/80",
        local.class
      )}
    >
      {local.children}
    </ul>
  )
}
