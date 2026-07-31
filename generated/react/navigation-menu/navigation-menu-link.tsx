import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type NavigationMenuLinkProps = ComponentPropsWithRef<"a">

export function NavigationMenuLink({ children, className, ...props }: NavigationMenuLinkProps) {
  return (
    <a
      {...props}
      data-slot="navigation-menu-link"
      className={cn(
        "group/navigation-link flex min-w-0 items-start gap-3 rounded-md px-3 py-3 text-left text-foreground no-underline transition-[background-color,color,transform] duration-150 hover:bg-foreground/[0.055] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring active:translate-y-px aria-[current=page]:bg-primary/10 aria-[current=page]:text-primary motion-reduce:transition-none",
        className
      )}
    >
      {children}
    </a>
  )
}
