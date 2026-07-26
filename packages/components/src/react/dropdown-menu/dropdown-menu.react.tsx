import { popoverPlacements, popoverSurface } from "@/+css/popover.css"
import { connectDropdownMenu } from "@/lib/dropdown-menu"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import { useEffect, useRef, type ComponentPropsWithoutRef } from "react"

const $placement = resolve(popoverPlacements)
const $surface = resolve(popoverSurface)

export type DropdownMenuProps = ComponentPropsWithoutRef<"div"> & {
  placement?: typeof $placement.infer
}

export function DropdownMenu({
  children,
  className,
  placement = "bottom-start",
  popover = "auto",
  role = "menu",
  tabIndex = -1,
  ...props
}: DropdownMenuProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectDropdownMenu(element)
    return () => controller.destroy()
  }, [])

  return (
    <div
      {...props}
      ref={elementRef}
      popover={popover}
      role={role}
      tabIndex={tabIndex}
      data-placement={placement}
      data-slot="dropdown-menu"
      className={cn(
        $surface,
        $placement(placement),
        "min-w-48 max-w-72 overscroll-contain p-0",
        className
      )}
    >
      {children}
    </div>
  )
}
