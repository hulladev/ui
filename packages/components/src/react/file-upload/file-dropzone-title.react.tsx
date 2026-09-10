import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type FileDropzoneTitleProps = ComponentPropsWithRef<"span">

export function FileDropzoneTitle({ children, className, ...props }: FileDropzoneTitleProps) {
  return (
    <span
      {...props}
      data-slot="file-dropzone-title"
      className={cn("font-medium text-foreground", className)}
    >
      {children}
    </span>
  )
}
