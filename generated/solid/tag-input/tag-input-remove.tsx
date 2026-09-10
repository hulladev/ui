import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type TagInputRemoveProps = Omit<JSX.IntrinsicElements["button"], "aria-label"> & {
  "aria-label": string
}

export function TagInputRemove(props: TagInputRemoveProps) {
  const [local, rest] = splitProps(props, ["children", "class", "type"])
  return (
    <button
      {...rest}
      type={local.type ?? "button"}
      data-slot="tag-input-remove"
      class={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-[0.25rem] text-muted-foreground transition-colors enabled:hover:bg-hover-surface enabled:hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:text-disabled-foreground motion-reduce:transition-none [&>svg]:size-3",
        local.class
      )}
    >
      {local.children ?? (
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
          <path d="m4 4 8 8m0-8-8 8" stroke="currentColor" stroke-linecap="round" />
        </svg>
      )}
    </button>
  )
}
