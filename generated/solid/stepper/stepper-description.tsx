import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type StepperDescriptionProps = JSX.IntrinsicElements["span"]

export function StepperDescription(props: StepperDescriptionProps) {
  const [local, rest] = splitProps(props, ["children", "class"])
  return (
    <span
      {...rest}
      data-slot="stepper-description"
      class={cn(
        "text-xs font-normal leading-4 text-muted-foreground group-data-[variant=ordered]/stepper:text-sm group-data-[variant=ordered]/stepper:leading-5",
        local.class
      )}
    >
      {local.children}
    </span>
  )
}
