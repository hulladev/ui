import { mergeProps, splitProps, type JSX } from "solid-js"
import { createMutableRef, exposeRef, createLifecycleEffect, onMountEffect } from "@/lib/solid"
import {
  connectSelect,
  SELECT_VALUE_CHANGE_EVENT,
  type SelectController,
  type SelectValue,
  type SelectValueChangeDetail,
} from "@/lib/select"
import { cn } from "@/lib/style"

type SelectBaseProps = Omit<JSX.IntrinsicElements["div"], "defaultValue"> & {
  defaultValue?: SelectValue
  disabled?: boolean
  form?: string
  name?: string
  required?: boolean
}

type SingleSelectProps = {
  multiple?: false
  onValueChange?: (value: string) => void
  value?: string
}

type MultipleSelectProps = {
  multiple: true
  onValueChange?: (value: string[]) => void
  value?: string[]
}

export type SelectProps = SelectBaseProps & (SingleSelectProps | MultipleSelectProps)

export function Select(props: SelectProps) {
  const [local, rest] = splitProps(
    mergeProps({ disabled: false, multiple: false, required: false } as const, props),
    [
      "children",
      "class",
      "defaultValue",
      "disabled",
      "form",
      "multiple",
      "name",
      "onValueChange",
      "required",
      "value",
    ]
  )
  const elementRef = createMutableRef<HTMLDivElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLDivElement)
  const controllerRef = createMutableRef<SelectController>(null)

  onMountEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectSelect(element)
    controllerRef.current = controller

    const handleValueChange = (event: Event) => {
      const nextValue = (event as CustomEvent<SelectValueChangeDetail>).detail.value
      if (Array.isArray(nextValue)) {
        ;(local.onValueChange as MultipleSelectProps["onValueChange"])?.(nextValue)
      } else {
        ;(local.onValueChange as SingleSelectProps["onValueChange"])?.(nextValue)
      }

      if (local.value !== undefined) {
        queueMicrotask(() => controller.setValue(local.value as SelectValue))
      }
    }

    element.addEventListener(SELECT_VALUE_CHANGE_EVENT, handleValueChange)

    return () => {
      element.removeEventListener(SELECT_VALUE_CHANGE_EVENT, handleValueChange)
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
    () => [local.disabled, local.multiple, local.value]
  )

  const initialValue = () => local.value ?? local.defaultValue ?? (local.multiple ? [] : "")

  return (
    <div
      {...rest}
      ref={elementRef}
      data-disabled={local.disabled ? "true" : "false"}
      data-initial-value={JSON.stringify(initialValue())}
      data-multiple={local.multiple ? "true" : "false"}
      data-slot="select"
      class={cn("relative grid w-full min-w-0", local.class)}
    >
      {local.children}
      <select
        aria-hidden="true"
        data-slot="select-native-control"
        disabled={local.disabled}
        form={local.form}
        inert
        multiple={local.multiple}
        name={local.name}
        required={local.required}
        tabindex={-1}
        class="pointer-events-none absolute bottom-0 left-0 size-px opacity-0"
      />
    </div>
  )
}
