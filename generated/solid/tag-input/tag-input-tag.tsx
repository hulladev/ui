import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type TagInputTagProps = JSX.IntrinsicElements["span"]

export function TagInputTag(props: TagInputTagProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <span
      {...rest}
      data-slot="tag-input-tag"
      class={cn(
        "inline-flex max-w-full items-center gap-1 rounded-sm border border-border bg-foreground/[0.035] py-1 pl-2.5 pr-1 text-[0.8125rem] font-medium text-foreground [&>[data-tag-label]]:min-w-0 [&>[data-tag-label]]:truncate",
        local.class
      )}
    >
      {local.children}
    </span>
  )
}
