import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type FileDropzoneTitleProps = JSX.IntrinsicElements["span"]

export function FileDropzoneTitle(props: FileDropzoneTitleProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <span
      {...rest}
      data-slot="file-dropzone-title"
      class={cn("font-medium text-foreground", local.class)}
    >
      {local.children}
    </span>
  )
}
