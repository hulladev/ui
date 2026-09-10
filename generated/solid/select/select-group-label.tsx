import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type SelectGroupLabelProps = JSX.IntrinsicElements["div"]

export function SelectGroupLabel(props: SelectGroupLabelProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <div
      {...rest}
      data-slot="select-group-label"
      class={cn(
        "px-3 pt-2 pb-1 font-mono text-[0.625rem] font-medium tracking-[0.08em] text-muted-foreground uppercase",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
