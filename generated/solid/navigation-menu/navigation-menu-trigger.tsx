import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type NavigationMenuTriggerProps = JSX.IntrinsicElements["button"]

export function NavigationMenuTrigger(props: NavigationMenuTriggerProps) {
  const [local, rest] = splitProps(mergeProps({ type: "button" } as const, props), [
    "children",
    "class",
    "type",
  ])

  return (
    <button
      {...rest}
      type={local.type}
      aria-expanded="false"
      data-slot="navigation-menu-trigger"
      data-state="closed"
      class={cn(
        "relative inline-flex min-h-10 cursor-pointer select-none items-center gap-2 rounded-md border-0 bg-transparent px-3.5 py-2 text-sm font-medium tracking-[-0.012em] text-muted-foreground transition-[background-color,color] duration-150 after:size-1.5 after:-translate-y-0.5 after:rotate-45 after:border-r after:border-b after:border-current after:content-[''] hover:bg-foreground/[0.055] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring data-[state=open]:bg-foreground/[0.055] data-[state=open]:text-foreground data-[state=open]:after:translate-y-0.5 data-[state=open]:after:-rotate-[135deg] disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:after:transition-none",
        local.class
      )}
    >
      {local.children}
    </button>
  )
}
