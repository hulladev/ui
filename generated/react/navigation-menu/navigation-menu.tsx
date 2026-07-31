import { connectNavigationMenu } from "@/lib/navigation-menu"
import { cn } from "@/lib/style"
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"

export type NavigationMenuProps = ComponentPropsWithRef<"nav"> & {
  closeDelay?: number
  openDelay?: number
}

export function NavigationMenu({
  children,
  className,
  closeDelay = 180,
  openDelay = 90,
  ...props
}: NavigationMenuProps) {
  const elementRef = useRef<HTMLElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLElement, [])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectNavigationMenu(element)
    return () => controller.destroy()
  }, [])

  return (
    <nav
      {...props}
      ref={elementRef}
      data-close-delay={closeDelay}
      data-open-delay={openDelay}
      data-slot="navigation-menu"
      className={cn("relative isolate w-fit text-foreground", className)}
    >
      {children}
    </nav>
  )
}
