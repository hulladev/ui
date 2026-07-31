import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type TableCaptionProps = JSX.IntrinsicElements["caption"]

export function TableCaption(props: TableCaptionProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <caption
      {...rest}
      data-slot="table-caption"
      class={cn(
        "caption-bottom px-4 py-3 text-left text-xs leading-5 text-muted-foreground",
        local.class
      )}
    >
      {local.children}
    </caption>
  )
}
