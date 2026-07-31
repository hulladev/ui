import { vn, cn } from "@/lib/style"
import {
  connectToggle,
  TOGGLE_PRESSED_CHANGE_EVENT,
  type ToggleController,
  type TogglePressedChangeDetail,
} from "@/lib/toggle"
import { useEffect, useImperativeHandle, useRef, useState, type ComponentPropsWithRef } from "react"

const $size = vn({
  sm: "min-h-7 gap-1.5 rounded-sm px-2 text-xs",
  md: "min-h-8 gap-1.5 rounded-sm px-2.5 text-[0.8125rem]",
  lg: "min-h-10 gap-2 rounded-md px-3 text-sm",
})
const $variant = vn({
  default:
    "border-transparent bg-transparent text-muted-foreground shadow-none hover:bg-foreground/[0.05] hover:text-foreground aria-pressed:text-primary aria-pressed:[&_svg]:fill-current",
  outline:
    "border-border bg-surface text-muted-foreground shadow-xs hover:border-foreground/25 hover:bg-foreground/[0.04] hover:text-foreground aria-pressed:border-primary/45 aria-pressed:text-primary aria-pressed:[&_svg]:fill-current",
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
  variant = "default",
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
        "inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border font-medium leading-none outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring active:translate-y-px disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:translate-y-0 [&_svg]:pointer-events-none [&_svg]:size-[1em] [&_svg]:shrink-0",
        $variant(variant),
        $size(size),
        className
      )}
    >
      {children}
    </button>
  )
}
