import { cn } from "@/lib/style"
import { splitProps, type JSX } from "solid-js"

export type StepperProps = JSX.IntrinsicElements["ol"] & { orientation?: "horizontal" | "vertical" }

export function Stepper(props: StepperProps) {
  const [local, rest] = splitProps(props, ["children", "class", "orientation"])
  return (
    <ol
      {...rest}
      data-orientation={local.orientation ?? "horizontal"}
      role="list"
      data-slot="stepper"
      class={cn(
        "group/stepper m-0 flex w-full min-w-0 list-none gap-5 p-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-4",
        local.class
      )}
    >
      {local.children}
    </ol>
  )
}
