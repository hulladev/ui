import { mergeProps, splitProps, type JSX } from "solid-js"
import { createMutableRef, exposeRef, createLifecycleEffect, onMountEffect } from "@/lib/solid"
import {
  COMBOBOX_VALUE_CHANGE_EVENT,
  connectCombobox,
  type ComboboxController,
  type ComboboxValue,
  type ComboboxValueChangeDetail,
} from "@/lib/combobox"
import { cn } from "@/lib/style"

type ComboboxBaseProps = Omit<JSX.IntrinsicElements["div"], "defaultValue"> & {
  defaultValue?: ComboboxValue
  disabled?: boolean
  form?: string
  name?: string
  required?: boolean
}

type SingleComboboxProps = {
  multiple?: false
  onValueChange?: (value: string) => void
  value?: string
}

type MultipleComboboxProps = {
  multiple: true
  onValueChange?: (value: string[]) => void
  value?: string[]
}

export type ComboboxProps = ComboboxBaseProps & (SingleComboboxProps | MultipleComboboxProps)

export function Combobox(props: ComboboxProps) {
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
  const controllerRef = createMutableRef<ComboboxController>(null)

  onMountEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectCombobox(element)
    controllerRef.current = controller

    const handleValueChange = (event: Event) => {
      const nextValue = (event as CustomEvent<ComboboxValueChangeDetail>).detail.value
      if (Array.isArray(nextValue)) {
        ;(local.onValueChange as MultipleComboboxProps["onValueChange"])?.(nextValue)
      } else {
        ;(local.onValueChange as SingleComboboxProps["onValueChange"])?.(nextValue)
      }

      if (local.value !== undefined) {
        queueMicrotask(() => controller.setValue(local.value as ComboboxValue))
      }
    }

    element.addEventListener(COMBOBOX_VALUE_CHANGE_EVENT, handleValueChange)

    return () => {
      element.removeEventListener(COMBOBOX_VALUE_CHANGE_EVENT, handleValueChange)
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
      data-slot="combobox"
      class={cn("relative grid w-full min-w-0", local.class)}
    >
      {local.children}
      <select
        aria-hidden="true"
        data-slot="combobox-native-control"
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
