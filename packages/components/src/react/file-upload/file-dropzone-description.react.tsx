import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type FileDropzoneDescriptionProps = ComponentPropsWithRef<"span">

export function FileDropzoneDescription({
  children,
  className,
  ...props
}: FileDropzoneDescriptionProps) {
  return (
    <span
      {...props}
      data-slot="file-dropzone-description"
      className={cn("text-xs text-muted-foreground", className)}
    >
      {children}
    </span>
  )
}
