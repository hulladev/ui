import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type TagInputProps = JSX.IntrinsicElements["div"]

export function TagInput(props: TagInputProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <div
      {...rest}
      data-slot="tag-input"
      class={cn(
        "flex min-h-11 w-full min-w-0 flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface p-1.5 shadow-xs transition-[border-color,box-shadow] focus-within:border-focus-ring focus-within:ring-2 focus-within:ring-focus-ring/25 has-[[aria-invalid=true]]:border-danger motion-reduce:transition-none",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
