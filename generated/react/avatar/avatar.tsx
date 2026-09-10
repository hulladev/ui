import { vn, cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

const $size = vn({
  sm: "size-6 text-[0.6875rem]",
  md: "size-8 text-sm",
  lg: "size-10 text-lg",
})

export type AvatarProps = ComponentPropsWithRef<"span"> & {
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
