import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type BackdropProps = JSX.IntrinsicElements["div"]

export function Backdrop(props: BackdropProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <div
      {...rest}
      aria-hidden="true"
      data-slot="backdrop"
      class={cn(
        "fixed inset-0 bg-foreground/40 backdrop-blur-[3px] transition-[display,opacity] duration-150 [transition-behavior:allow-discrete] motion-reduce:transition-none motion-reduce:backdrop-blur-none dark:bg-background/72 dark:backdrop-blur-[8px] [&[hidden]]:hidden [&[hidden]]:pointer-events-none [&[hidden]]:opacity-0 starting:opacity-0",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
