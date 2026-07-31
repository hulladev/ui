import {
  connectSelect,
  SELECT_VALUE_CHANGE_EVENT,
  type SelectController,
  type SelectValue,
  type SelectValueChangeDetail,
} from "@/lib/select"
import { cn } from "@/lib/style"
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"

type SelectBaseProps = Omit<ComponentPropsWithRef<"div">, "defaultValue"> & {
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
  const {
    children,
    className,
    defaultValue,
    disabled = false,
    form,
    multiple = false,
    name,
    onValueChange,
    required = false,
    value,
    ...rootProps
  } = props
  const elementRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLDivElement, [])
  const controllerRef = useRef<SelectController>(null)
  const valueRef = useRef(value)
  const onValueChangeRef = useRef(onValueChange)
  valueRef.current = value
  onValueChangeRef.current = onValueChange

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectSelect(element)
    controllerRef.current = controller

    const handleValueChange = (event: Event) => {
      const nextValue = (event as CustomEvent<SelectValueChangeDetail>).detail.value
      if (Array.isArray(nextValue)) {
        ;(onValueChangeRef.current as MultipleSelectProps["onValueChange"])?.(nextValue)
      } else {
        ;(onValueChangeRef.current as SingleSelectProps["onValueChange"])?.(nextValue)
      }

      if (valueRef.current !== undefined) {
        queueMicrotask(() => controller.setValue(valueRef.current as SelectValue))
      }
    }

    element.addEventListener(SELECT_VALUE_CHANGE_EVENT, handleValueChange)

    return () => {
      element.removeEventListener(SELECT_VALUE_CHANGE_EVENT, handleValueChange)
      controller.destroy()
      controllerRef.current = null
    }
  }, [])

  useEffect(() => {
    const controller = controllerRef.current
    if (!controller) return
    controller.refresh()
    if (value !== undefined) controller.setValue(value)
  }, [disabled, multiple, value])

  const initialValue = value ?? defaultValue ?? (multiple ? [] : "")

  return (
    <div
      {...rootProps}
      ref={elementRef}
      data-disabled={disabled ? "true" : "false"}
      data-initial-value={JSON.stringify(initialValue)}
      data-multiple={multiple ? "true" : "false"}
      data-slot="select"
      className={cn("relative grid w-full min-w-0", className)}
    >
      {children}
      <select
        aria-hidden="true"
        data-slot="select-native-control"
        disabled={disabled}
        form={form}
        inert
        multiple={multiple}
        name={name}
        required={required}
        tabIndex={-1}
        className="pointer-events-none absolute bottom-0 left-0 size-px opacity-0"
      />
    </div>
  )
}
