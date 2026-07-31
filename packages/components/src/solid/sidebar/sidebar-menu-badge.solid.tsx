import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type SidebarMenuBadgeProps = JSX.IntrinsicElements["span"]

export function SidebarMenuBadge(props: SidebarMenuBadgeProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <span
      {...rest}
      data-slot="sidebar-menu-badge"
      class={cn(
        "pointer-events-none absolute top-1/2 right-2 inline-flex min-w-5 -translate-y-1/2 items-center justify-center rounded-sm bg-foreground/[0.065] px-1 font-mono text-[0.625rem] leading-5 font-medium tabular-nums text-muted-foreground",
        local.class
      )}
    >
      {local.children}
    </span>
  )
}
