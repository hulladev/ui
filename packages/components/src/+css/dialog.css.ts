import { vn } from "@/lib/style"

export const dialogOverlayVariants = vn({
  compact: "p-4 [&[hidden]>[data-slot=dialog]]:[transform:translateY(4px)_scale(0.98)]",
  workspace: "p-2 sm:p-6 [&[hidden]>[data-slot=dialog]]:[transform:translateY(4px)]",
  fullscreen: "p-0",
})

export const dialogVariants = vn({
  compact:
    "starting:[transform:translateY(4px)_scale(0.98)] max-w-lg rounded-lg border border-border p-6 shadow-(--shadow-overlay) dark:border-foreground/15 dark:bg-surface-raised/84 dark:backdrop-blur-2xl",
  workspace:
    "starting:[transform:translateY(4px)] flex h-[calc(100dvh-1rem)] max-w-[90rem] flex-col rounded-lg border border-border shadow-(--shadow-overlay) dark:border-foreground/15 dark:bg-surface-raised/88 dark:backdrop-blur-2xl sm:h-[calc(100dvh-3rem)]",
  fullscreen: "flex h-dvh max-w-none flex-col rounded-none border-0 shadow-none",
})
