import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type TableHeaderProps = JSX.IntrinsicElements["thead"]

export function TableHeader(props: TableHeaderProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <thead
      {...rest}
      data-slot="table-header"
      class={cn("[&_th]:border-b [&_th]:border-border", local.class)}
    >
      {local.children}
    </thead>
  )
}
