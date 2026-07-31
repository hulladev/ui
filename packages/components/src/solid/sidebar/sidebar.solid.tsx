import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type SidebarProps = JSX.IntrinsicElements["aside"]

export function Sidebar(props: SidebarProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <aside
      {...rest}
      data-slot="sidebar"
      class={cn(
        "flex h-full min-h-0 w-64 shrink-0 flex-col overflow-hidden border-r border-border bg-surface text-foreground",
        local.class
      )}
    >
      {local.children}
    </aside>
  )
}
