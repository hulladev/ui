import { cn } from "@/lib/style"
import { handleTagInputKeyDown } from "@/lib/tag-input"
import type { ComponentPropsWithRef } from "react"

export type TagInputControlProps = Omit<ComponentPropsWithRef<"input">, "type"> & {
  onTagAdd?: (value: string) => boolean | void
}

export function TagInputControl({
  className,
  onKeyDown,
  onTagAdd,
  ...props
}: TagInputControlProps) {
  return (
    <input
      {...props}
      type="text"
      data-slot="tag-input-control"
      className={cn(
        "min-h-7 min-w-20 flex-1 border-0 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:text-disabled-foreground disabled:placeholder:text-disabled-foreground",
        className
      )}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        handleTagInputKeyDown(event.nativeEvent, event.currentTarget, onTagAdd)
      }}
    />
  )
}
