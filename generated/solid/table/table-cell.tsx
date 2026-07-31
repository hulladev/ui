import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type TableCellProps = JSX.IntrinsicElements["td"]

export function TableCell(props: TableCellProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <td
      {...rest}
      data-slot="table-cell"
      class={cn("px-4 py-3 align-middle tabular-nums", local.class)}
    >
      {local.children}
    </td>
  )
}
