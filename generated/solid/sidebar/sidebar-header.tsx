import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type SidebarHeaderProps = JSX.IntrinsicElements["header"]

export function SidebarHeader(props: SidebarHeaderProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <header
      {...rest}
      data-slot="sidebar-header"
      class={cn("shrink-0 border-b border-border p-3", local.class)}
    >
      {local.children}
    </header>
  )
}
