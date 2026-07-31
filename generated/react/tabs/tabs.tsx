import {
  connectTabs,
  TABS_VALUE_CHANGE_EVENT,
  type TabsController,
  type TabsValueChangeDetail,
} from "@/lib/tabs"
import { cn } from "@/lib/style"
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"

export type TabsProps = Omit<ComponentPropsWithRef<"div">, "defaultValue"> & {
  activationMode?: "automatic" | "manual"
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: "horizontal" | "vertical"
  value?: string
}

export function Tabs({
  activationMode = "automatic",
  children,
  className,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  value,
  ...props
}: TabsProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLDivElement, [])
  const controllerRef = useRef<TabsController>(null)
  const valueRef = useRef(value)
  const onValueChangeRef = useRef(onValueChange)
  valueRef.current = value
  onValueChangeRef.current = onValueChange

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectTabs(element)
    controllerRef.current = controller

    const handleValueChange = (event: Event) => {
      const nextValue = (event as CustomEvent<TabsValueChangeDetail>).detail.value
      onValueChangeRef.current?.(nextValue)

      if (valueRef.current !== undefined) {
        queueMicrotask(() => controller.setValue(valueRef.current ?? ""))
      }
    }

    element.addEventListener(TABS_VALUE_CHANGE_EVENT, handleValueChange)

    return () => {
      element.removeEventListener(TABS_VALUE_CHANGE_EVENT, handleValueChange)
      controller.destroy()
      controllerRef.current = null
    }
  }, [])

  useEffect(() => {
    const controller = controllerRef.current
    if (!controller) return
    controller.refresh()
    if (value !== undefined) controller.setValue(value)
  }, [activationMode, orientation, value])

  return (
    <div
      {...props}
      ref={elementRef}
      data-activation-mode={activationMode}
      data-initial-value={value ?? defaultValue}
      data-orientation={orientation}
      data-slot="tabs"
      className={cn(
        "grid min-w-0 gap-4 data-[orientation=vertical]:grid-cols-[auto_minmax(0,1fr)] data-[orientation=vertical]:items-start",
        className
      )}
    >
      {children}
    </div>
  )
}
