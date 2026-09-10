import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type FieldOutputProps = JSX.IntrinsicElements["output"]

export function FieldOutput(props: FieldOutputProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <output
      {...rest}
      data-slot="field-output"
      class={cn("shrink-0 font-mono text-xs tabular-nums text-muted-foreground", local.class)}
    >
      {local.children}
    </output>
  )
}
