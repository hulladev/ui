import {
  formatCalendarValue,
  serializeCalendarValue,
  type CalendarDateRange,
  type CalendarDisabledDate,
  type CalendarValue,
} from "@/lib/calendar"
import {
  connectDatePicker,
  DATE_PICKER_VALUE_CHANGE_EVENT,
  type DatePickerController,
  type DatePickerValueChangeDetail,
} from "@/lib/date-picker"
import { cn } from "@/lib/style"
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"
import { Button } from "../button/button"
import { Calendar } from "../calendar/calendar"
import { Popover } from "../popover/popover"

type DatePickerBaseProps = Omit<ComponentPropsWithRef<"div">, "defaultValue"> & {
  defaultMonth?: string
  disabled?: boolean
  disabledDates?: readonly CalendarDisabledDate[]
  form?: string
  locale?: string
  max?: string
  min?: string
  month?: string
  onMonthChange?: (month: string) => void
  placeholder?: string
  today?: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

type SingleDatePickerProps = {
  defaultValue?: string | null
  name?: string
  onValueChange?: (value: string | null) => void
  selectionMode?: "single"
  value?: string | null
}

type RangeDatePickerProps = {
  defaultValue?: CalendarDateRange | null
  endName?: string
  onValueChange?: (value: CalendarDateRange | null) => void
  selectionMode: "range"
  startName?: string
  value?: CalendarDateRange | null
}

export type DatePickerProps = DatePickerBaseProps & (SingleDatePickerProps | RangeDatePickerProps)

export function DatePicker(props: DatePickerProps) {
  const {
    className,
    defaultMonth,
    defaultValue,
    disabled = false,
    disabledDates,
    locale,
    max,
    min,
    month,
    onMonthChange,
    onValueChange,
    placeholder,
    selectionMode = "single",
    today,
    value,
    weekStartsOn,
    ...selectionProps
  } = props
  const { endName, form, name, startName, ...rootProps } =
    selectionProps as ComponentPropsWithRef<"div"> & {
      endName?: string
      form?: string
      name?: string
      startName?: string
    }
  const elementRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLDivElement, [])
  const controllerRef = useRef<DatePickerController>(null)
  const valueRef = useRef<CalendarValue | undefined>(value)
  const onValueChangeRef = useRef(onValueChange)
  valueRef.current = value
  onValueChangeRef.current = onValueChange

  const initialValue = (value ?? defaultValue ?? null) as CalendarValue
  const fallback =
    placeholder ?? (selectionMode === "range" ? "Choose a date range" : "Choose a date")
  const formattedValue = formatCalendarValue(initialValue, selectionMode, locale)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectDatePicker(element)
    controllerRef.current = controller

    const handleValueChange = (event: Event) => {
      const nextValue = (event as CustomEvent<DatePickerValueChangeDetail>).detail.value
      if (selectionMode === "range") {
        ;(onValueChangeRef.current as RangeDatePickerProps["onValueChange"])?.(
          nextValue && typeof nextValue !== "string" ? nextValue : null
        )
      } else {
        ;(onValueChangeRef.current as SingleDatePickerProps["onValueChange"])?.(
          typeof nextValue === "string" ? nextValue : null
        )
      }

      if (valueRef.current !== undefined) {
        queueMicrotask(() => controller.setValue(valueRef.current ?? null))
      }
    }

    element.addEventListener(DATE_PICKER_VALUE_CHANGE_EVENT, handleValueChange)
    return () => {
      element.removeEventListener(DATE_PICKER_VALUE_CHANGE_EVENT, handleValueChange)
      controller.destroy()
      controllerRef.current = null
    }
  }, [selectionMode])

  useEffect(() => {
    const controller = controllerRef.current
    if (!controller) return
    controller.refresh()
    if (value !== undefined) controller.setValue(value)
  }, [locale, placeholder, selectionMode, value])

  return (
    <div
      {...rootProps}
      ref={elementRef}
      data-initial-value={serializeCalendarValue(initialValue)}
      data-locale={locale}
      data-placeholder={placeholder}
      data-selection-mode={selectionMode}
      data-slot="date-picker"
      className={cn("relative inline-grid min-w-0", className)}
    >
      <Button
        variant="outline"
        disabled={disabled}
        aria-expanded="false"
        aria-haspopup="dialog"
        data-slot="date-picker-trigger"
        className="min-w-52 justify-between gap-3 bg-surface px-3 text-left font-normal shadow-xs"
      >
        <span
          data-slot="date-picker-value"
          data-state={formattedValue ? "value" : "placeholder"}
          className="min-w-0 flex-1 overflow-hidden text-ellipsis data-[state=placeholder]:text-muted-foreground"
        >
          {formattedValue || fallback}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          className="size-4 text-muted-foreground"
        >
          <path
            d="M3.25 4.75h9.5M5 2.5v3M11 2.5v3M3 7.25h10v5.25H3z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>

      {selectionMode === "range" ? (
        <>
          <input
            type="hidden"
            disabled={disabled}
            form={form}
            name={startName}
            data-slot="date-picker-start-input"
            defaultValue={
              initialValue && typeof initialValue !== "string" ? initialValue.start : ""
            }
          />
          <input
            type="hidden"
            disabled={disabled}
            form={form}
            name={endName}
            data-slot="date-picker-end-input"
            defaultValue={
              initialValue && typeof initialValue !== "string" ? (initialValue.end ?? "") : ""
            }
          />
        </>
      ) : (
        <input
          type="hidden"
          disabled={disabled}
          form={form}
          name={name}
          data-slot="date-picker-input"
          defaultValue={typeof initialValue === "string" ? initialValue : ""}
        />
      )}

      <Popover
        role="dialog"
        placement="bottom-start"
        data-date-picker-popover=""
        data-slot="date-picker-popover"
        className="max-h-[calc(100dvh-1rem)] max-w-[calc(100vw-1rem)] overflow-visible p-0"
      >
        {selectionMode === "range" ? (
          <Calendar
            defaultMonth={defaultMonth}
            defaultValue={initialValue && typeof initialValue !== "string" ? initialValue : null}
            disabledDates={disabledDates}
            locale={locale}
            max={max}
            min={min}
            month={month}
            onMonthChange={onMonthChange}
            selectionMode="range"
            today={today}
            weekStartsOn={weekStartsOn}
          />
        ) : (
          <Calendar
            defaultMonth={defaultMonth}
            defaultValue={typeof initialValue === "string" ? initialValue : null}
            disabledDates={disabledDates}
            locale={locale}
            max={max}
            min={min}
            month={month}
            onMonthChange={onMonthChange}
            today={today}
            weekStartsOn={weekStartsOn}
          />
        )}
      </Popover>
    </div>
  )
}
