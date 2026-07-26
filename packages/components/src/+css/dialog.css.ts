import { vn } from "@/lib/style"

export const dialogOverlayVariants = vn({
  compact: "p-4",
  workspace: "p-2 sm:p-6",
  fullscreen: "p-0",
})

export const dialogVariants = vn({
  compact:
    "max-w-lg rounded-lg border border-border p-6 shadow-[0_1.5rem_5rem_-1.75rem_oklch(0_0_0/0.28)] dark:border-foreground/15 dark:bg-surface-raised/84 dark:shadow-[0_1.75rem_7rem_-2rem_oklch(0_0_0/0.9),inset_0_1px_0_oklch(1_0_0/0.08)] dark:backdrop-blur-2xl",
  workspace:
    "flex h-[calc(100dvh-1rem)] max-w-[90rem] flex-col rounded-lg border border-border shadow-[0_1.5rem_5rem_-1.75rem_oklch(0_0_0/0.28)] dark:border-foreground/15 dark:bg-surface-raised/88 dark:shadow-[0_1.75rem_7rem_-2rem_oklch(0_0_0/0.9),inset_0_1px_0_oklch(1_0_0/0.08)] dark:backdrop-blur-2xl sm:h-[calc(100dvh-3rem)]",
  fullscreen: "flex h-dvh max-w-none flex-col rounded-none border-0 shadow-none",
})
