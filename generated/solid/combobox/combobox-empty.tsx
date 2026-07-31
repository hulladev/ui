import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type ComboboxEmptyProps = JSX.IntrinsicElements["div"]

export function ComboboxEmpty(props: ComboboxEmptyProps) {
  const [local, rest] = splitProps(mergeProps({ role: "status" } as const, props), [
    "children",
    "class",
    "role",
  ])

  return (
    <div
      {...rest}
      hidden
      role={local.role}
      data-slot="combobox-empty"
      class={cn(
        "px-3 py-6 text-center text-[0.8125rem] leading-5 text-muted-foreground",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
