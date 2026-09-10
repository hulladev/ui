import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type FileDropzoneIconProps = JSX.IntrinsicElements["span"]

export function FileDropzoneIcon(props: FileDropzoneIconProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <span
      {...rest}
      data-slot="file-dropzone-icon"
      class={cn(
        "mx-auto mb-2 flex size-6 items-center justify-center text-muted-foreground [&>svg]:size-full",
        local.class
      )}
    >
      {local.children}
    </span>
  )
}
