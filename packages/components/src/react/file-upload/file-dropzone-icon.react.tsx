import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type FileDropzoneIconProps = ComponentPropsWithRef<"span">

export function FileDropzoneIcon({ children, className, ...props }: FileDropzoneIconProps) {
  return (
    <span
      {...props}
      data-slot="file-dropzone-icon"
      className={cn(
        "mx-auto mb-2 flex size-6 items-center justify-center text-muted-foreground [&>svg]:size-full",
        className
      )}
    >
      {children}
    </span>
  )
}
