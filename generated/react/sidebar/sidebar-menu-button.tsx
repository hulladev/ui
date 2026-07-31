import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

const $control = vn({
  default:
    "relative flex min-h-9 w-full min-w-0 items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm leading-5 text-muted-foreground no-underline transition-[background-color,color] duration-150 hover:bg-foreground/[0.055] hover:text-foreground aria-[current=page]:bg-primary/[0.09] aria-[current=page]:font-medium aria-[current=page]:text-primary aria-[current=page]:before:absolute aria-[current=page]:before:inset-y-2 aria-[current=page]:before:left-0 aria-[current=page]:before:w-0.5 aria-[current=page]:before:rounded-full aria-[current=page]:before:bg-primary aria-[current=page]:[&>svg]:text-primary focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring disabled:pointer-events-none disabled:opacity-45 motion-reduce:transition-none [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground",
})

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
