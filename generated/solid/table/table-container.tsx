import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type TableContainerProps = JSX.IntrinsicElements["div"]

export function TableContainer(props: TableContainerProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <div
      {...rest}
      data-slot="table-container"
      class={cn("min-w-0 overflow-x-auto rounded-md border border-border bg-surface", local.class)}
    >
      {local.children}
    </div>
  )
}
