import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type SidebarGroupProps = JSX.IntrinsicElements["section"]

export function SidebarGroup(props: SidebarGroupProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <section {...rest} data-slot="sidebar-group" class={cn("min-w-0 py-1.5", local.class)}>
      {local.children}
    </section>
  )
}
