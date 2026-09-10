import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type NavigationMenuLinkProps = JSX.IntrinsicElements["a"]

export function NavigationMenuLink(props: NavigationMenuLinkProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <a
      {...rest}
      data-slot="navigation-menu-link"
      class={cn(
        "group/navigation-link flex min-w-0 items-start gap-3 rounded-md px-3 py-3 text-left text-foreground no-underline transition-[background-color,color,transform] duration-150 hover:bg-hover-surface focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring active:translate-y-px aria-[current=page]:bg-selected-surface aria-[current=page]:hover:bg-selected-hover-surface aria-[current=page]:text-primary-text motion-reduce:transition-none",
        local.class
      )}
    >
      {local.children}
    </a>
  )
}
