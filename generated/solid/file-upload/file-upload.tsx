import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type FileUploadProps = Omit<JSX.IntrinsicElements["input"], "type">

export function FileUpload(props: FileUploadProps) {
  const [local, rest] = splitProps(props, ["class"])
  return (
    <input
      {...rest}
      type="file"
      data-slot="file-upload"
      class={cn(
        "block w-full min-w-0 rounded-md border border-border bg-surface p-1.5 text-sm text-muted-foreground shadow-xs file:mr-3 file:rounded-sm file:border-0 file:bg-foreground/5 file:px-3 file:py-2 file:font-medium file:text-foreground enabled:hover:file:bg-hover-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:text-disabled-foreground disabled:bg-disabled-surface disabled:border-disabled-border disabled:shadow-none disabled:file:text-disabled-foreground disabled:file:cursor-not-allowed aria-invalid:border-danger",
        local.class
      )}
    />
  )
}
