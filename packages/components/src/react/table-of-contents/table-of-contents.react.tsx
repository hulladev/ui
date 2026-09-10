"use client"

import { connectTableOfContents } from "@/lib/table-of-contents"
import { cn } from "@/lib/style"
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"

export type TableOfContentsProps = ComponentPropsWithRef<"nav"> & {
  for: string
  /** Active-section threshold in pixels. Match the sections' scroll-margin-top. */
  offset?: number
}

export function TableOfContents({
  children,
  className,
  for: target,
  offset = 96,
  ref,
  ...props
}: TableOfContentsProps) {
  const element = useRef<HTMLElement>(null)
  useImperativeHandle(ref, () => element.current as HTMLElement, [])
  useEffect(() => {
    if (!element.current) return
    return connectTableOfContents(element.current).destroy
  }, [])
  return (
    <nav
      aria-label="On this page"
      {...props}
      ref={element}
      data-slot="table-of-contents"
      data-toc-for={target}
      data-toc-offset={offset}
      className={cn("grid gap-3 text-sm text-foreground", className)}
    >
      {children}
      <ol
        data-slot="table-of-contents-list"
        className="m-0 grid list-none gap-1 border-l border-border p-0"
      />
    </nav>
  )
}
