import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

const $size = vn({
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-12 text-base",
})

export type AvatarProps = ComponentPropsWithoutRef<"span"> & {
  size?: typeof $size.infer
}

export function Avatar({ children, className, size = "md", ...props }: AvatarProps) {
  return (
    <span
      {...props}
      data-slot="avatar"
      data-size={size}
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-foreground/5 text-muted-foreground ring-1 ring-border ring-inset",
        $size(size),
        className
      )}
    >
      {children}
    </span>
  )
}
