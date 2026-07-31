import { connectRangeSlider, type RangeSliderController } from "@/lib/range-slider"
import { cn } from "@/lib/style"
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"

export type RangeSliderProps = Omit<ComponentPropsWithRef<"div">, "role">

export function RangeSlider({ children, className, ...props }: RangeSliderProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLDivElement, [])
  const controllerRef = useRef<RangeSliderController>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectRangeSlider(element)
    controllerRef.current = controller

    return () => {
      controller.destroy()
      controllerRef.current = null
    }
  }, [])

  useEffect(() => {
    controllerRef.current?.refresh()
  })

  return (
    <div
      {...props}
      ref={elementRef}
      role="group"
      data-slot="range-slider"
      className={cn(
        "relative grid h-6 w-full min-w-0 items-center before:pointer-events-none before:absolute before:inset-x-0 before:h-1.5 before:rounded-full before:bg-foreground/[0.14] before:shadow-inner after:pointer-events-none after:absolute after:left-[var(--range-slider-start,0%)] after:h-1.5 after:w-[var(--range-slider-size,100%)] after:rounded-full after:bg-primary dark:before:bg-foreground/[0.22] has-[[aria-invalid=true]]:after:bg-danger",
        className
      )}
    >
      {children}
    </div>
  )
}
