import { connectTableOfContents } from "@/lib/table-of-contents"
import { createMutableRef, exposeRef, onMountEffect } from "@/lib/solid"
import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type TableOfContentsProps = JSX.IntrinsicElements["nav"] & {
  for: string
  /** Active-section threshold in pixels. Match the sections' scroll-margin-top. */
  offset?: number
}

export function TableOfContents(props: TableOfContentsProps) {
  const [local, rest] = splitProps(props, ["children", "class", "for", "offset", "ref"])
  const element = createMutableRef<HTMLElement>(null)
  exposeRef(local.ref, () => element.current as HTMLElement)
  onMountEffect(() => {
    if (!element.current) return
    return connectTableOfContents(element.current).destroy
  })
  return (
    <nav
      aria-label="On this page"
      {...rest}
      ref={element}
      data-slot="table-of-contents"
      data-toc-for={local.for}
      data-toc-offset={local.offset ?? 96}
      class={cn("grid gap-3 text-sm text-foreground", local.class)}
    >
      {local.children}
      <ol
        data-slot="table-of-contents-list"
        class="m-0 grid list-none gap-1 border-l border-border p-0"
      />
    </nav>
  )
}
