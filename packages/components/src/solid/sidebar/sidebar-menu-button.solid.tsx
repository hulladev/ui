import { mergeProps, splitProps, type JSX } from "solid-js"
import { sidebarMenuControls } from "@/+css/sidebar.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $control = resolve(sidebarMenuControls)

export type SidebarMenuButtonProps = JSX.IntrinsicElements["button"]

export function SidebarMenuButton(props: SidebarMenuButtonProps) {
  const [local, rest] = splitProps(mergeProps({ type: "button" } as const, props), [
    "children",
    "class",
    "type",
  ])

  return (
    <button
      {...rest}
      type={local.type}
      data-slot="sidebar-menu-button"
      class={cn($control("default"), local.class)}
    >
      {local.children}
    </button>
  )
}
