import { vn, cn } from "@/lib/style"
import {
  connectToggle,
  TOGGLE_PRESSED_CHANGE_EVENT,
  type ToggleController,
  type TogglePressedChangeDetail,
} from "@/lib/toggle"
import { useEffect, useImperativeHandle, useRef, useState, type ComponentPropsWithRef } from "react"

const $size = vn({
  sm: "h-7 gap-1.5 rounded-[6px] px-2.5 text-xs [&>svg]:size-3.5",
  md: "h-8 gap-1.5 rounded-[7px] px-3 text-sm [&>svg]:size-4",
  lg: "h-9 gap-2 rounded-[8px] px-3 text-base [&>svg]:size-4.5",
})
const $variant = vn({
  outline:
    "border-foreground/20 bg-transparent text-foreground shadow-none enabled:hover:border-foreground/40 enabled:hover:bg-foreground/[0.08] enabled:aria-pressed:border-primary/60 enabled:aria-pressed:bg-selected-surface enabled:aria-pressed:hover:bg-selected-hover-surface enabled:aria-pressed:text-primary-text",
  ghost:
    "border-transparent bg-transparent text-muted-foreground shadow-none enabled:hover:bg-foreground/[0.08] enabled:hover:text-foreground enabled:aria-pressed:bg-selected-surface enabled:aria-pressed:hover:bg-selected-hover-surface enabled:aria-pressed:text-primary-text",
  inverted:
    "border-foreground/20 bg-transparent text-foreground shadow-none enabled:hover:border-foreground/40 enabled:hover:bg-foreground/[0.08] enabled:aria-pressed:border-foreground enabled:aria-pressed:bg-foreground enabled:aria-pressed:text-background enabled:aria-pressed:hover:border-foreground/80 enabled:aria-pressed:hover:bg-foreground/80",
})

export type ToggleProps = Omit<ComponentPropsWithRef<"button">, "aria-pressed"> & {
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  pressed?: boolean
  size?: typeof $size.infer
  variant?: typeof $variant.infer
}

export function Toggle({
  children,
  className,
  defaultPressed = false,
  onPressedChange,
  pressed,
  size = "md",
  type = "button",
  variant = "outline",
  ...props
}: ToggleProps) {
  const [uncontrolledPressed, setUncontrolledPressed] = useState(defaultPressed)
  const elementRef = useRef<HTMLButtonElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLButtonElement, [])
  const controllerRef = useRef<ToggleController>(null)
  const pressedRef = useRef(pressed)
  const onPressedChangeRef = useRef(onPressedChange)
  pressedRef.current = pressed
  onPressedChangeRef.current = onPressedChange
  const resolvedPressed = pressed ?? uncontrolledPressed

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectToggle(element)
    controllerRef.current = controller

    const handlePressedChange = (event: Event) => {
      const nextPressed = (event as CustomEvent<TogglePressedChangeDetail>).detail.pressed
      onPressedChangeRef.current?.(nextPressed)

      if (pressedRef.current !== undefined) {
        queueMicrotask(() => controller.setPressed(pressedRef.current ?? false))
      } else {
        setUncontrolledPressed(nextPressed)
      }
    }

    element.addEventListener(TOGGLE_PRESSED_CHANGE_EVENT, handlePressedChange)

    return () => {
      element.removeEventListener(TOGGLE_PRESSED_CHANGE_EVENT, handlePressedChange)
      controller.destroy()
      controllerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (pressed !== undefined) controllerRef.current?.setPressed(pressed)
  }, [pressed])

  return (
    <button
      {...props}
      ref={elementRef}
      aria-pressed={resolvedPressed}
      type={type}
      data-size={size}
      data-slot="toggle"
      data-state={resolvedPressed ? "on" : "off"}
      data-variant={variant}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border font-medium leading-none outline-none transition-[background-color,border-color,color,box-shadow,translate] duration-120 ease-out focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring enabled:not-aria-disabled:active:translate-y-px disabled:cursor-not-allowed disabled:text-disabled-foreground disabled:bg-disabled-surface disabled:border-disabled-border disabled:shadow-none disabled:aria-pressed:bg-foreground/10 disabled:aria-pressed:border-disabled-foreground/40 motion-reduce:transition-none motion-reduce:enabled:not-aria-disabled:active:translate-y-0 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        $variant(variant),
        $size(size),
        className
      )}
    >
      {children}
    </button>
  )
}
