import { vn, cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

const $menu = vn({
  default:
    "relative isolate m-0 grid min-w-0 list-none gap-0.5 p-0 [--sidebar-railed:var(--sidebar-lines,0)] [--sidebar-inset:calc(0.625rem+var(--sidebar-railed)*0.875rem)] [&>li]:[--sidebar-child-indent:calc(var(--sidebar-inset)-0.125rem)] data-[lines=none]:[--sidebar-lines:0] data-[lines=all]:[--sidebar-lines:1] data-[lines=nested]:[--sidebar-lines:initial] before:pointer-events-none before:absolute before:inset-y-0 before:left-[calc(var(--sidebar-inset)-0.875rem)] before:z-10 before:w-px before:bg-border before:opacity-[var(--sidebar-railed)] [&_[data-slot=sidebar-menu]]:[--sidebar-inset:calc(var(--sidebar-child-indent)+1.5rem)] [&_[data-slot=sidebar-menu]]:mt-0.5 [&_[data-slot=sidebar-menu]]:[--sidebar-railed:var(--sidebar-lines,1)]",
})

export type SidebarMenuProps = JSX.IntrinsicElements["ul"] & {
  /** Hierarchy lines for this branch. Defaults to nested; descendants may override. */
  lines?: "none" | "nested" | "all"
}

export function SidebarMenu(props: SidebarMenuProps) {
  const [local, rest] = splitProps(props, ["children", "class", "lines"])

  return (
    <ul
      {...rest}
      data-slot="sidebar-menu"
      data-lines={local.lines}
      class={cn($menu("default"), local.class)}
    >
      {local.children}
    </ul>
  )
}
