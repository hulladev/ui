import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type SelectValueProps = JSX.IntrinsicElements["span"] & {
  placeholder?: string
}

export function SelectValue(props: SelectValueProps) {
  const [local, rest] = splitProps(mergeProps({ placeholder: "" } as const, props), [
    "children",
    "class",
    "placeholder",
  ])

  return (
    <span
      {...rest}
      data-placeholder={local.placeholder}
      data-slot="select-value"
      class={cn(
        "min-w-0 flex-1 truncate data-[state=placeholder]:text-muted-foreground",
        local.class
      )}
    >
      {local.children ?? local.placeholder}
    </span>
  )
}
