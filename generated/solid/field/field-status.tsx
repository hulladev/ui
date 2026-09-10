import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type FieldStatusProps = JSX.IntrinsicElements["output"]

export function FieldStatus(props: FieldStatusProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <output
      {...rest}
      data-slot="field-status"
      class={cn(
        "flex min-h-5 items-center gap-2 text-xs text-muted-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        local.class
      )}
    >
      {local.children}
    </output>
  )
}
