import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type StepperContentProps = JSX.IntrinsicElements["span"]

export function StepperContent(props: StepperContentProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <span
      {...rest}
      data-slot="stepper-content"
      class={cn(
        "grid min-w-0 gap-1 group-data-[variant=ordered]/stepper:self-center group-data-[variant=ordered]/stepper:text-base group-data-[variant=ordered]/stepper:leading-6 group-data-[variant=ordered]/stepper:font-semibold",
        local.class
      )}
    >
      {local.children}
    </span>
  )
}
