import { variant } from "@/style"

export const buttonCss = variant({
  name: "variant",
  classes: {
    primary: "bg-blue-500",
    outlined: "bg-transparent border border-gray-300",
  },
  base: "cursor-pointer rounded-sm",
  default: "primary",
})
