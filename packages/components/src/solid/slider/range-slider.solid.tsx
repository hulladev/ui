import { createMutableRef, exposeRef, onMountEffect } from "@/lib/solid"
import { splitProps, type JSX } from "solid-js"
import { connectRangeSlider, type RangeSliderController } from "@/lib/range-slider"
import { cn } from "@/lib/style"

export type RangeSliderProps = Omit<JSX.IntrinsicElements["div"], "role">

export function RangeSlider(props: RangeSliderProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  const elementRef = createMutableRef<HTMLDivElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLDivElement, [])
  const controllerRef = createMutableRef<RangeSliderController>(null)

  onMountEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectRangeSlider(element)
    controllerRef.current = controller

    return () => {
      controller.destroy()
      controllerRef.current = null
    }
  })

  onMountEffect(() => {
    controllerRef.current?.refresh()
  })

  return (
    <div
      {...rest}
      ref={elementRef}
      role="group"
      data-slot="range-slider"
      class={cn(
        "relative grid h-6 w-full min-w-0 items-center before:pointer-events-none before:absolute before:inset-x-0 before:h-1.5 before:rounded-full before:bg-foreground/[0.14] before:shadow-inner after:pointer-events-none after:absolute after:left-[var(--range-slider-start,0%)] after:h-1.5 after:w-[var(--range-slider-size,100%)] after:rounded-full after:bg-primary dark:before:bg-foreground/[0.22] has-[[aria-invalid=true]]:after:bg-danger",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
