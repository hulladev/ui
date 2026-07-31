import { createMutableRef, exposeRef, onMountEffect } from "@/lib/solid"
import { mergeProps, splitProps, type JSX } from "solid-js"
import { connectNavigationMenu } from "@/lib/navigation-menu"
import { cn } from "@/lib/style"

export type NavigationMenuProps = JSX.IntrinsicElements["nav"] & {
  closeDelay?: number
  openDelay?: number
}

export function NavigationMenu(props: NavigationMenuProps) {
  const [local, rest] = splitProps(mergeProps({ closeDelay: 180, openDelay: 90 } as const, props), [
    "children",
    "class",
    "closeDelay",
    "openDelay",
  ])

  const elementRef = createMutableRef<HTMLElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLElement, [])

  onMountEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectNavigationMenu(element)
    return () => controller.destroy()
  })

  return (
    <nav
      {...rest}
      ref={elementRef}
      data-close-delay={local.closeDelay}
      data-open-delay={local.openDelay}
      data-slot="navigation-menu"
      class={cn("relative isolate w-fit text-foreground", local.class)}
    >
      {local.children}
    </nav>
  )
}
