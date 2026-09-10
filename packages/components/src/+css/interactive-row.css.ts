import { vn } from "@/lib/style"

export const interactiveRow = vn({
  default:
    "rounded-md text-muted-foreground transition-[background-color,color] duration-100 [&:not(:disabled):not([aria-disabled=true])]:hover:bg-hover-surface [&:not(:disabled):not([aria-disabled=true])]:hover:text-foreground motion-reduce:transition-none",
})
