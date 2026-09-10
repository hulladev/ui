import {
  connectToggleGroup,
  TOGGLE_GROUP_VALUE_CHANGE_EVENT,
  type ToggleGroupController,
  type ToggleGroupType,
  type ToggleGroupValue,
  type ToggleGroupValueChangeDetail,
} from "@/lib/toggle"
import { cn } from "@/lib/style"
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"

export type ToggleGroupProps = Omit<ComponentPropsWithRef<"div">, "defaultValue" | "onChange"> & {
  defaultValue?: ToggleGroupValue
  onValueChange?: (value: ToggleGroupValue) => void
  orientation?: "horizontal" | "vertical"
  required?: boolean
  type?: ToggleGroupType
  value?: ToggleGroupValue
}

export function ToggleGroup({
  children,
  className,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  required = false,
  role = "group",
  type = "single",
  value,
  ...props
}: ToggleGroupProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLDivElement, [])
  const controllerRef = useRef<ToggleGroupController>(null)
  const valueRef = useRef(value)
  const onValueChangeRef = useRef(onValueChange)
  valueRef.current = value
  onValueChangeRef.current = onValueChange

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectToggleGroup(element)
    controllerRef.current = controller

    const handleValueChange = (event: Event) => {
      const nextValue = (event as CustomEvent<ToggleGroupValueChangeDetail>).detail.value
      onValueChangeRef.current?.(nextValue)

      if (valueRef.current !== undefined) {
        const controlledValue = valueRef.current
        queueMicrotask(() => controller.setValue(controlledValue))
      }
    }

    element.addEventListener(TOGGLE_GROUP_VALUE_CHANGE_EVENT, handleValueChange)

    return () => {
      element.removeEventListener(TOGGLE_GROUP_VALUE_CHANGE_EVENT, handleValueChange)
      controller.destroy()
      controllerRef.current = null
    }
  }, [])

  useEffect(() => {
    const controller = controllerRef.current
    if (!controller) return
    controller.refresh()
    if (value !== undefined) controller.setValue(value)
  }, [orientation, required, type, value])

  return (
    <div
      {...props}
      ref={elementRef}
      role={role}
      data-initial-value={JSON.stringify(value ?? defaultValue ?? (type === "multiple" ? [] : ""))}
      data-orientation={orientation}
      data-required={required}
      data-slot="toggle-group"
      data-type={type}
      className={cn(
        "isolate inline-flex w-fit items-stretch gap-1 data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
        className
      )}
    >
      {children}
    </div>
  )
}
