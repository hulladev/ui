import { vn, cn } from "@/lib/style"
import { mergeProps, splitProps, type JSX } from "solid-js"

const $variant = vn({
  plain: "",
  divided:
    "bg-surface dark:bg-[linear-gradient(145deg,var(--color-surface-raised)_0%,color-mix(in_oklab,var(--color-surface-raised)_84%,var(--color-background))_100%)] dark:shadow-[inset_0_1px_0_color-mix(in_oklab,var(--color-foreground)_8%,transparent),0_12px_28px_-22px_oklch(0_0_0/0.88)] [&_tbody_td]:border-b [&_tbody_td]:border-border [&_tbody_th]:border-b [&_tbody_th]:border-border [&_tbody_tr:last-child_td]:border-b-0 [&_tbody_tr:last-child_th]:border-b-0",
  striped:
    "overflow-hidden rounded-md border border-border bg-surface shadow-xs [&_thead]:bg-foreground/[0.065] [&_tbody_tr:nth-child(odd)]:bg-foreground/[0.035] dark:[&_thead]:bg-foreground/[0.085] dark:[&_tbody_tr:nth-child(odd)]:bg-foreground/[0.055]",
})

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
