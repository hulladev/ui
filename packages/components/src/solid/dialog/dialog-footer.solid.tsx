import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type DialogFooterProps = JSX.IntrinsicElements["div"]

export function DialogFooter(props: DialogFooterProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <div
      {...rest}
      data-slot="dialog-footer"
      class={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end group-data-[variant=compact]/dialog:mt-6 group-data-[variant=workspace]/dialog:mt-auto group-data-[variant=workspace]/dialog:shrink-0 group-data-[variant=workspace]/dialog:border-t group-data-[variant=workspace]/dialog:border-border group-data-[variant=workspace]/dialog:px-6 group-data-[variant=workspace]/dialog:py-4 group-data-[variant=fullscreen]/dialog:mt-auto group-data-[variant=fullscreen]/dialog:shrink-0 group-data-[variant=fullscreen]/dialog:border-t group-data-[variant=fullscreen]/dialog:border-border group-data-[variant=fullscreen]/dialog:px-5 group-data-[variant=fullscreen]/dialog:py-5 sm:group-data-[variant=fullscreen]/dialog:px-8",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
