import { sidebarMenuControls } from "@/+css/sidebar.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithRef } from "react"

const $control = resolve(sidebarMenuControls)

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
      className={cn($control("default"), className)}
    >
      {children}
    </button>
  )
}
