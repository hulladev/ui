import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type TableOfContentsSectionProps = JSX.IntrinsicElements["div"] & {
  id: string
  label: string
}

export function TableOfContentsSection(props: TableOfContentsSectionProps) {
  const [local, rest] = splitProps(props, ["children", "class", "id", "label"])
  return (
    <div
      tabIndex={-1}
      {...rest}
      id={local.id}
      data-slot="table-of-contents-section"
      data-toc-label={local.label}
      class={cn("scroll-mt-24", local.class)}
    >
      {local.children}
    </div>
  )
}
