import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type CommandEmptyProps = JSX.IntrinsicElements["div"]

export function CommandEmpty(props: CommandEmptyProps) {
  const [local, rest] = splitProps(mergeProps({ hidden: true, role: "status" } as const, props), [
    "children",
    "class",
    "hidden",
    "role",
  ])

  return (
    <div
      {...rest}
      hidden={local.hidden}
      role={local.role}
      data-slot="command-empty"
      class={cn("px-4 py-10 text-center text-sm text-muted-foreground", local.class)}
    >
      {local.children}
    </div>
  )
}
