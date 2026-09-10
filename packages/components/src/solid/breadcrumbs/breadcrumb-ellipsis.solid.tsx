import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type BreadcrumbEllipsisProps = JSX.IntrinsicElements["span"]

export function BreadcrumbEllipsis(props: BreadcrumbEllipsisProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <span
      {...rest}
      data-slot="breadcrumb-ellipsis"
      class={cn("inline-flex font-mono tracking-[0.12em]", local.class)}
    >
      {local.children ?? (
        <>
          <span aria-hidden="true">···</span>
          <span class="sr-only">More pages</span>
        </>
      )}
    </span>
  )
}
