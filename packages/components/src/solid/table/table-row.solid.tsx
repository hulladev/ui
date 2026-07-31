import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type TableRowProps = JSX.IntrinsicElements["tr"]

export function TableRow(props: TableRowProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <tr
      {...rest}
      data-slot="table-row"
      class={cn(
        "transition-colors hover:bg-foreground/[0.045] data-[state=selected]:bg-primary/10",
        local.class
      )}
    >
      {local.children}
    </tr>
  )
}
