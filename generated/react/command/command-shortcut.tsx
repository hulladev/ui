import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CommandShortcutProps = ComponentPropsWithRef<"span">

export function CommandShortcut({
  children,
  className,
  "aria-hidden": ariaHidden = true,
  ...props
}: CommandShortcutProps) {
  return (
    <span
      {...props}
      aria-hidden={ariaHidden}
      data-slot="command-shortcut"
      className={cn(
        "ml-auto whitespace-nowrap pl-3 font-mono text-[0.625rem] tracking-[0.06em] text-muted-foreground group-data-[selected]/command-item:text-foreground/70",
        className
      )}
    >
      {children}
    </span>
  )
}
