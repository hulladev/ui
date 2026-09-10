import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type FileDropzoneProps = ComponentPropsWithRef<"label">

export function FileDropzone({ children, className, ...props }: FileDropzoneProps) {
  return (
    <label
      {...props}
      data-slot="file-dropzone"
      className={cn(
        "relative grid min-h-44 place-content-center gap-2 rounded-lg border border-dashed border-foreground/25 bg-surface p-6 text-center text-sm transition-colors has-[:enabled]:hover:border-primary/60 has-[:enabled]:hover:bg-selected-surface has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus-ring has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-disabled-surface has-[:disabled]:border-disabled-border has-[:disabled]:text-disabled-foreground has-[[aria-invalid=true]]:border-danger [&>[data-slot=file-upload]]:absolute [&>[data-slot=file-upload]]:inset-0 [&>[data-slot=file-upload]]:h-full [&>[data-slot=file-upload]]:w-full [&>[data-slot=file-upload]]:cursor-pointer [&>[data-slot=file-upload]]:opacity-0 [&>[data-slot=file-upload]:disabled]:cursor-not-allowed motion-reduce:transition-none",
        className
      )}
    >
      {children}
    </label>
  )
}
