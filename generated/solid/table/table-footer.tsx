import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type TableFooterProps = JSX.IntrinsicElements["tfoot"]

export function TableFooter(props: TableFooterProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <tfoot
      {...rest}
      data-slot="table-footer"
      class={cn(
        "font-medium [&_td]:border-t [&_td]:border-border [&_th]:border-t [&_th]:border-border [&_tr]:bg-foreground/[0.035]",
        local.class
      )}
    >
      {local.children}
    </tfoot>
  )
}
