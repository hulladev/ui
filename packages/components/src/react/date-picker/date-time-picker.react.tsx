import { formControlSizes, formControlVariants } from "@/+css/form-control.css"
import { resolve } from "@hulla/ui"
import { type CalendarDisabledDate } from "@/lib/calendar"
import {
  connectDateTimePicker,
  DATE_TIME_PICKER_VALUE_CHANGE_EVENT,
  formatLocalDateTime,
  isLocalDateTime,
  type DateTimePickerController,
  type DateTimePickerValueChangeDetail,
} from "@/lib/date-picker"
import { cn } from "@/lib/style"
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"
import { Button } from "../button/button.react"
import { Calendar } from "../calendar/calendar.react"
import { Popover } from "../popover/popover.react"
import { TimePicker } from "../time-picker/time-picker.react"

const $size = resolve(formControlSizes)
const $variant = resolve(formControlVariants)

export type DateTimePickerProps = Omit<ComponentPropsWithRef<"div">, "defaultValue"> & {
  defaultMonth?: string
  defaultTime?: string
  defaultValue?: string | null
  disabled?: boolean
  disabledDates?: readonly CalendarDisabledDate[]
  form?: string
  hourCycle?: "h11" | "h12" | "h23" | "h24"
  locale?: string
  max?: string
  min?: string
  month?: string
  name?: string
  onMonthChange?: (month: string) => void
  onValueChange?: (value: string | null) => void
  placeholder?: string
  timeStep?: number
  today?: string
  value?: string | null
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

export function DateTimePicker({
  className,
  defaultMonth,
  defaultTime = "09:00",
  defaultValue,
  disabled = false,
  disabledDates,
  form,
  hourCycle = "h23",
  locale,
  max,
  min,
  month,
  name,
  onMonthChange,
  onValueChange,
  placeholder = "Choose a date and time",
  timeStep = 30,
  today,
  value,
  weekStartsOn,
  ...props
}: DateTimePickerProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLDivElement, [])
  const controllerRef = useRef<DateTimePickerController>(null)
  const valueRef = useRef(value)
  const onValueChangeRef = useRef(onValueChange)
  valueRef.current = value
  onValueChangeRef.current = onValueChange

  const initialValue = isLocalDateTime(value)
    ? value
    : isLocalDateTime(defaultValue)
      ? defaultValue
      : null
  const initialDate = initialValue?.slice(0, 10)
  const initialTime = initialValue?.slice(11, 16) ?? defaultTime
  const minDate = isLocalDateTime(min) ? min.slice(0, 10) : undefined
  const maxDate = isLocalDateTime(max) ? max.slice(0, 10) : undefined

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectDateTimePicker(element)
    controllerRef.current = controller

    const handleValueChange = (event: Event) => {
      const nextValue = (event as CustomEvent<DateTimePickerValueChangeDetail>).detail.value
      onValueChangeRef.current?.(nextValue)
      if (valueRef.current !== undefined) {
        queueMicrotask(() => controller.setValue(valueRef.current ?? null))
      }
    }

    element.addEventListener(DATE_TIME_PICKER_VALUE_CHANGE_EVENT, handleValueChange)
    return () => {
      element.removeEventListener(DATE_TIME_PICKER_VALUE_CHANGE_EVENT, handleValueChange)
      controller.destroy()
      controllerRef.current = null
    }
  }, [])

  useEffect(() => {
    const controller = controllerRef.current
    if (!controller) return
    controller.refresh()
    if (value !== undefined) controller.setValue(value)
  }, [defaultTime, hourCycle, locale, max, min, placeholder, value])

  return (
    <div
      {...props}
      ref={elementRef}
      data-default-time={defaultTime}
      data-hour-cycle={hourCycle}
      data-initial-value={JSON.stringify(initialValue)}
      data-locale={locale}
      data-max={max}
      data-min={min}
      data-placeholder={placeholder}
      data-slot="date-time-picker"
      className={cn("relative inline-grid min-w-0", className)}
    >
      <button
        type="button"
        data-control
        aria-invalid={props["aria-invalid"]}
        disabled={disabled}
        aria-expanded="false"
        aria-haspopup="dialog"
        data-slot="date-time-picker-trigger"
        className={cn(
          "flex w-full min-w-0 appearance-none items-center justify-between gap-3 text-left font-normal text-foreground antialiased transition-[background-color,border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none disabled:cursor-not-allowed disabled:text-disabled-foreground disabled:placeholder:text-disabled-foreground [&>svg]:shrink-0",
          $size("md"),
          $variant("outline")
        )}
      >
        <span
          data-slot="date-time-picker-value"
          data-state={initialValue ? "value" : "placeholder"}
          className="min-w-0 flex-1 overflow-hidden text-ellipsis data-[state=placeholder]:text-muted-foreground"
        >
          {initialValue ? formatLocalDateTime(initialValue, locale, hourCycle) : placeholder}
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
          <path
            d="M10.75 9v1.75l1 1"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <input
        type="hidden"
        disabled={disabled}
        form={form}
        name={name}
        data-slot="date-time-picker-input"
        defaultValue={initialValue ?? ""}
      />

      <Popover
        role="dialog"
        placement="bottom-start"
        data-date-time-picker-popover=""
        data-slot="date-time-picker-popover"
        className="max-h-[calc(100dvh-1rem)] max-w-[calc(100vw-1rem)] overflow-visible p-0"
      >
        <Calendar
          defaultMonth={defaultMonth}
          defaultValue={initialDate}
          disabledDates={disabledDates}
          locale={locale}
          max={maxDate}
          min={minDate}
          month={month}
          onMonthChange={onMonthChange}
          today={today}
          weekStartsOn={weekStartsOn}
          className="rounded-b-none"
        />

        <div className="flex items-end gap-2 border-t border-border/80 bg-foreground/[0.025] p-3">
          <div className="grid min-w-0 flex-1 gap-1.5">
            <span className="text-[0.6875rem] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
              Time
            </span>
            <TimePicker
              defaultValue={initialTime}
              hourCycle={hourCycle}
              locale={locale}
              step={timeStep}
              className="[&_[data-slot=time-picker-trigger]]:w-full"
            />
          </div>
          <Button type="button" data-slot="date-time-picker-apply">
            Apply
          </Button>
        </div>
      </Popover>
    </div>
  )
}
