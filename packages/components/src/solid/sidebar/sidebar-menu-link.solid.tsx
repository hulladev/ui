import { splitProps, type JSX } from "solid-js"
import { sidebarMenuControls } from "@/+css/sidebar.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $control = resolve(sidebarMenuControls)

export type SidebarMenuLinkProps = JSX.IntrinsicElements["a"]

export function SidebarMenuLink(props: SidebarMenuLinkProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <a {...rest} data-slot="sidebar-menu-link" class={cn($control("default"), local.class)}>
      {local.children}
    </a>
  )
}
