import { createMutableRef, exposeRef, createLifecycleEffect, onMountEffect } from "@/lib/solid"
import { mergeProps, splitProps, type JSX } from "solid-js"
import {
  connectToggleGroup,
  TOGGLE_GROUP_VALUE_CHANGE_EVENT,
  type ToggleGroupController,
  type ToggleGroupType,
  type ToggleGroupValue,
  type ToggleGroupValueChangeDetail,
} from "@/lib/toggle"
import { cn } from "@/lib/style"

export type ToggleGroupProps = Omit<JSX.IntrinsicElements["div"], "defaultValue" | "onChange"> & {
  defaultValue?: ToggleGroupValue
  onValueChange?: (value: ToggleGroupValue) => void
  orientation?: "horizontal" | "vertical"
  required?: boolean
  type?: ToggleGroupType
  value?: ToggleGroupValue
}

export function ToggleGroup(props: ToggleGroupProps) {
  const [local, rest] = splitProps(
    mergeProps(
      { orientation: "horizontal", required: false, role: "group", type: "single" } as const,
      props
    ),
    [
      "children",
      "class",
      "defaultValue",
      "onValueChange",
      "orientation",
      "required",
      "role",
      "type",
      "value",
    ]
  )

  const elementRef = createMutableRef<HTMLDivElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLDivElement, [])
  const controllerRef = createMutableRef<ToggleGroupController>(null)
  onMountEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectToggleGroup(element)
    controllerRef.current = controller

    const handleValueChange = (event: Event) => {
      const nextValue = (event as CustomEvent<ToggleGroupValueChangeDetail>).detail.value
      local.onValueChange?.(nextValue)

      if (local.value !== undefined) {
        const controlledValue = local.value
        queueMicrotask(() => controller.setValue(controlledValue))
      }
    }

    element.addEventListener(TOGGLE_GROUP_VALUE_CHANGE_EVENT, handleValueChange)

    return () => {
      element.removeEventListener(TOGGLE_GROUP_VALUE_CHANGE_EVENT, handleValueChange)
      controller.destroy()
      controllerRef.current = null
    }
  })

  createLifecycleEffect(
    () => {
      const controller = controllerRef.current
      if (!controller) return
      controller.refresh()
      if (local.value !== undefined) controller.setValue(local.value)
    },
    () => [local.orientation, local.required, local.type, local.value]
  )

  return (
    <div
      {...rest}
      ref={elementRef}
      role={local.role}
      data-initial-value={JSON.stringify(
        local.value ?? local.defaultValue ?? (local.type === "multiple" ? [] : "")
      )}
      data-orientation={local.orientation}
      data-required={local.required}
      data-slot="toggle-group"
      data-type={local.type}
      class={cn(
        "isolate inline-flex w-fit items-stretch data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:[&>[data-slot=toggle]:not(:first-child)]:-ml-px data-[orientation=horizontal]:[&>[data-slot=toggle]:not(:first-child)]:rounded-l-none data-[orientation=horizontal]:[&>[data-slot=toggle]:not(:last-child)]:rounded-r-none data-[orientation=vertical]:flex-col data-[orientation=vertical]:[&>[data-slot=toggle]:not(:first-child)]:-mt-px data-[orientation=vertical]:[&>[data-slot=toggle]:not(:first-child)]:rounded-t-none data-[orientation=vertical]:[&>[data-slot=toggle]:not(:last-child)]:rounded-b-none",
        local.class
      )}
    >
      {local.children}
    </div>
  )
}
