import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type TabsContentProps = JSX.IntrinsicElements["div"] & {
  value: string
}

export function TabsContent(props: TabsContentProps) {
  const [local, rest] = splitProps(mergeProps({ role: "tabpanel", tabIndex: 0 } as const, props), [
    "children",
    "class",
    "role",
    "tabIndex",
    "value",
  ])

  return (
    <div
      {...rest}
      role={local.role}
      tabindex={local.tabIndex}
      hidden
      data-slot="tabs-content"
      data-value={local.value}
      class={cn(
        "min-w-0 rounded-sm text-sm leading-6 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
