import { avatarSizes } from "@/+css/avatar.css"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import type { ComponentPropsWithRef } from "react"

const $size = resolve(avatarSizes)

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
