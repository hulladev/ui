import { cn } from "@/lib/style"
import { handleTagInputKeyDown } from "@/lib/tag-input"
import { splitProps, type JSX } from "solid-js"

export type TagInputControlProps = Omit<JSX.IntrinsicElements["input"], "type"> & {
  onTagAdd?: (value: string) => boolean | void
}

export function TagInputControl(props: TagInputControlProps) {
  const [local, rest] = splitProps(props, ["class", "onKeyDown", "onTagAdd"])
  return (
    <input
      {...rest}
      type="text"
      data-slot="tag-input-control"
      class={cn(
        "min-h-7 min-w-20 flex-1 border-0 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:text-disabled-foreground disabled:placeholder:text-disabled-foreground",
        local.class
      )}
      onKeyDown={(event) => {
        const handler = local.onKeyDown
        if (typeof handler === "function") handler(event)
        else if (handler) handler[0](handler[1], event)
        handleTagInputKeyDown(event, event.currentTarget, local.onTagAdd)
      }}
    />
  )
}
