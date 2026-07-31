import { createMutableRef, exposeRef, createLifecycleEffect, onMountEffect } from "@/lib/solid"
import { createSignal, mergeProps, splitProps, type JSX } from "solid-js"
import { toggleSizes, toggleVariants } from "@/+css/toggle.css"
import {
  connectToggle,
  TOGGLE_PRESSED_CHANGE_EVENT,
  type ToggleController,
  type TogglePressedChangeDetail,
} from "@/lib/toggle"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $size = resolve(toggleSizes)
const $variant = resolve(toggleVariants)

export type ToggleProps = Omit<JSX.IntrinsicElements["button"], "aria-pressed"> & {
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  pressed?: boolean
  size?: typeof $size.infer
  variant?: typeof $variant.infer
}

export function Toggle(props: ToggleProps) {
  const [local, rest] = splitProps(
    mergeProps(
      { defaultPressed: false, size: "md", type: "button", variant: "default" } as const,
      props
    ),
    ["children", "class", "defaultPressed", "onPressedChange", "pressed", "size", "type", "variant"]
  )

  const [uncontrolledPressed, setUncontrolledPressed] = createSignal(local.defaultPressed)
  const elementRef = createMutableRef<HTMLButtonElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLButtonElement, [])
  const controllerRef = createMutableRef<ToggleController>(null)
  const resolvedPressed = () => local.pressed ?? uncontrolledPressed()

  onMountEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectToggle(element)
    controllerRef.current = controller

    const handlePressedChange = (event: Event) => {
      const nextPressed = (event as CustomEvent<TogglePressedChangeDetail>).detail.pressed
      local.onPressedChange?.(nextPressed)

      if (local.pressed !== undefined) {
        queueMicrotask(() => controller.setPressed(local.pressed ?? false))
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
  })

  createLifecycleEffect(
    () => {
      if (local.pressed !== undefined) controllerRef.current?.setPressed(local.pressed)
    },
    () => [local.pressed]
  )

  return (
    <button
      {...rest}
      ref={elementRef}
      aria-pressed={resolvedPressed()}
      type={local.type}
      data-size={local.size}
      data-slot="toggle"
      data-state={resolvedPressed() ? "on" : "off"}
      data-variant={local.variant}
      class={cn(
        "inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap border font-medium leading-none outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring active:translate-y-px disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:translate-y-0 [&_svg]:pointer-events-none [&_svg]:size-[1em] [&_svg]:shrink-0",
        $variant(local.variant),
        $size(local.size),
        local.class
      )}
    >
      {local.children}
    </button>
  )
}
