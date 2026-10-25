import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type StepperProps = JSX.IntrinsicElements["ol"] & {
  orientation?: "horizontal" | "vertical"
  variant?: "progress" | "ordered"
  /** Extend the ordered variant’s final connector through its content with a fading end. */
  fadeLastStep?: boolean
}

export function Stepper(props: StepperProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "class",
    "orientation",
    "variant",
    "fadeLastStep",
  ])
  const variant = () => local.variant ?? "progress"
  const orientation = () =>
    variant() === "ordered" ? "vertical" : (local.orientation ?? "horizontal")
  return (
    <ol
      {...rest}
      data-orientation={orientation()}
      data-variant={variant()}
      data-fade-last-step={local.fadeLastStep ?? true}
      role="list"
      data-slot="stepper"
      class={cn(
        "group/stepper m-0 flex w-full min-w-0 list-none gap-5 p-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-4 data-[variant=ordered]:gap-0",
        local.class
      )}
    >
      {local.children}
    </ol>
  )
}
