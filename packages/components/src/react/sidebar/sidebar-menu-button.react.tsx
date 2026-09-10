import { interactiveRow } from "@/+css/interactive-row.css"
import { sidebarMenuControls } from "@/+css/sidebar.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithRef } from "react"

const $control = resolve(sidebarMenuControls)
const $interactiveRow = resolve(interactiveRow)

export type SidebarMenuButtonProps = ComponentPropsWithRef<"button">

export function SidebarMenuButton({
  children,
  className,
  type = "button",
  ...props
}: SidebarMenuButtonProps) {
  return (
    <button
      {...props}
      type={type}
      data-slot="sidebar-menu-button"
      className={cn($control("default"), $interactiveRow("default"), className)}
    >
      {children}
    </button>
  )
}
