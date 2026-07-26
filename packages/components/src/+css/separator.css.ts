import { vn } from "@/lib/style"

export const separatorOrientations = vn({
  horizontal: "h-0 w-full border-x-0 border-b-0 border-t",
  vertical: "h-auto min-h-4 w-0 self-stretch border-y-0 border-r-0 border-l",
})

export const separatorVariants = vn({
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
})
