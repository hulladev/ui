import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type SidebarFooterProps = JSX.IntrinsicElements["footer"]

export function SidebarFooter(props: SidebarFooterProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <footer
      {...rest}
      data-slot="sidebar-footer"
      class={cn("shrink-0 border-t border-border p-3", local.class)}
    >
      {local.children}
    </footer>
  )
}
