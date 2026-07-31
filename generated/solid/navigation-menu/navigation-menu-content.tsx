import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type NavigationMenuContentProps = JSX.IntrinsicElements["div"]

export function NavigationMenuContent(props: NavigationMenuContentProps) {
  const [local, rest] = splitProps(mergeProps({ role: "region" } as const, props), [
    "children",
    "class",
    "role",
  ])

  return (
    <div
      {...rest}
      role={local.role}
      hidden
      data-slot="navigation-menu-content"
      data-state="closed"
      class={cn(
        "absolute top-[calc(100%+0.625rem)] left-0 z-50 max-h-[min(32rem,calc(100dvh-6rem))] w-[min(44rem,calc(100vw-2rem))] overflow-auto rounded-lg border border-border/85 bg-surface-raised p-2 text-sm text-foreground opacity-100 shadow-[0_1.75rem_5rem_-1.5rem_oklch(0_0_0/0.3)] ring-1 ring-foreground/5 transition-[display,opacity,transform] duration-180 ease-out [transform:translateY(0)] [translate:var(--navigation-menu-shift-x,0px)_0] [transition-behavior:allow-discrete] before:absolute before:-top-3 before:right-0 before:left-0 before:h-3 before:content-[''] motion-reduce:transition-none starting:opacity-0 starting:[transform:translateY(-0.375rem)] dark:border-foreground/15 dark:shadow-[0_2rem_6rem_-1.25rem_oklch(0_0_0/0.78),inset_0_1px_0_oklch(1_0_0/0.07)]",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
