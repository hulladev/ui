import { mergeProps, splitProps, type JSX } from "solid-js"
import { tableVariants } from "@/+css/table.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $variant = resolve(tableVariants)

export type TableProps = JSX.IntrinsicElements["table"] & {
  variant?: typeof $variant.infer
}

export function Table(props: TableProps) {
  const [local, rest] = splitProps(mergeProps({ variant: "divided" } as const, props), [
    "children",
    "class",
    "variant",
  ])

  return (
    <table
      {...rest}
      data-slot="table"
      data-variant={local.variant}
      class={cn(
        "w-full border-separate border-spacing-0 text-left text-sm text-foreground",
        $variant(local.variant),
        local.class
      )}
    >
      {local.children}
    </table>
  )
}
