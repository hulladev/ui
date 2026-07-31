import { splitProps, type JSX } from "solid-js"
import { cn } from "@/lib/style"

export type FieldErrorProps = JSX.IntrinsicElements["p"]

export function FieldError(props: FieldErrorProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <p
      {...rest}
      data-slot="error"
      class={cn(
        "flex items-start gap-1.5 text-[0.8125rem] font-medium leading-5 text-danger before:mt-[0.45rem] before:block before:size-1 before:shrink-0 before:rounded-full before:bg-current empty:hidden",
        local.class
      )}
    >
      {local.children}
    </p>
  )
}
