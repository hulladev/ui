import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type CodeBlockHeaderProps = ComponentPropsWithRef<"div">

export function CodeBlockHeader({ children, className, ...props }: CodeBlockHeaderProps) {
  return (
    <div
      {...props}
      data-slot="code-block-header"
      className={cn(
        "flex min-h-12 min-w-0 items-center gap-3 border-b border-border bg-surface px-4 py-2.5 has-[>[data-slot=tabs-list]]:gap-0 has-[>[data-slot=tabs-list]]:p-0 [&>[data-slot=tabs-list]]:h-12 [&>[data-slot=tabs-list]]:min-w-0 [&>[data-slot=tabs-list]]:flex-1 [&>[data-slot=tabs-list]]:items-stretch [&>[data-slot=tabs-list]]:gap-0 [&>[data-slot=tabs-list]]:border-b-0 [&>[data-slot=tabs-list]]:px-0 [&>[data-slot=tabs-list]>[data-slot=tabs-trigger]]:h-full [&>[data-slot=tabs-list]>[data-slot=tabs-trigger]]:min-h-0 [&>[data-slot=tabs-list]>[data-slot=tabs-trigger]]:rounded-none [&>[data-slot=tabs-list]>[data-slot=tabs-trigger]]:border-r [&>[data-slot=tabs-list]>[data-slot=tabs-trigger]]:border-border [&>[data-slot=tabs-list]>[data-slot=tabs-trigger]]:after:inset-x-0 [&:has(>[data-slot=tabs-list])>[data-slot=code-block-actions]]:z-10 [&:has(>[data-slot=tabs-list])>[data-slot=code-block-actions]]:ml-0 [&:has(>[data-slot=tabs-list])>[data-slot=code-block-actions]]:self-stretch [&:has(>[data-slot=tabs-list])>[data-slot=code-block-actions]]:border-l [&:has(>[data-slot=tabs-list])>[data-slot=code-block-actions]]:border-border [&:has(>[data-slot=tabs-list])>[data-slot=code-block-actions]]:bg-surface [&:has(>[data-slot=tabs-list])>[data-slot=code-block-actions]]:px-3",
        className
      )}
    >
      {children}
    </div>
  )
}
