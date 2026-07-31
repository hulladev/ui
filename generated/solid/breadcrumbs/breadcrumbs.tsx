import { mergeProps, splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type BreadcrumbsProps = JSX.IntrinsicElements["nav"]

export function Breadcrumbs(props: BreadcrumbsProps) {
  const [local, rest] = splitProps(mergeProps({ "aria-label": "Breadcrumb" } as const, props), [
    "aria-label",
    "children",
    "class",
  ])

  return (
    <nav
      {...rest}
      aria-label={local["aria-label"]}
      data-slot="breadcrumbs"
      class={cn("min-w-0", local.class)}
    >
      <ol
        data-slot="breadcrumbs-list"
        class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-5 text-muted-foreground"
      >
        {local.children}
      </ol>
    </nav>
  )
}
