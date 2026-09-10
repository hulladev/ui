import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type FileDropzoneDescriptionProps = JSX.IntrinsicElements["span"]

export function FileDropzoneDescription(props: FileDropzoneDescriptionProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <span
      {...rest}
      data-slot="file-dropzone-description"
      class={cn("text-xs text-muted-foreground", local.class)}
    >
      {local.children}
    </span>
  )
}
