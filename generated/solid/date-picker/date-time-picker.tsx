import { vn, cn } from "@/lib/style"
import { createMutableRef, exposeRef, createLifecycleEffect, onMountEffect } from "@/lib/solid"
import { mergeProps, splitProps, type JSX } from "solid-js"
import { type CalendarDisabledDate } from "@/lib/calendar"
import {
  connectDateTimePicker,
  DATE_TIME_PICKER_VALUE_CHANGE_EVENT,
  formatLocalDateTime,
  isLocalDateTime,
  type DateTimePickerController,
  type DateTimePickerValueChangeDetail,
} from "@/lib/date-picker"
import { Button } from "../button/button"
import { Calendar } from "../calendar/calendar"
import { Popover } from "../popover/popover"
import { TimePicker } from "../time-picker/time-picker"

const $size = vn({
  sm: "h-8 rounded-sm px-2.5 text-[0.8125rem] [&[type=file]]:leading-[1.875rem] file:text-[0.8125rem]",
  md: "h-10 rounded-md px-3 text-sm [&[type=file]]:leading-[2.375rem] file:text-sm",
  lg: "h-12 rounded-md px-3.5 text-base [&[type=file]]:leading-[2.875rem] file:text-base",
})
const $variant = vn({
  outline:
    "border border-foreground/25 bg-surface shadow-[inset_0_1px_2px_oklch(0_0_0/0.025)] enabled:not-focus-visible:not-aria-invalid:hover:border-foreground/40 focus-visible:ring-2 focus-visible:ring-focus-ring/25 focus-visible:border-focus-ring enabled:aria-invalid:border-danger enabled:aria-invalid:hover:border-danger disabled:border-disabled-border disabled:bg-disabled-surface disabled:shadow-none",
  filled:
    "border border-transparent bg-foreground/[0.075] shadow-none enabled:not-focus-visible:not-aria-invalid:hover:bg-foreground/[0.12] focus-visible:ring-2 focus-visible:ring-focus-ring/25 focus-visible:border-focus-ring focus-visible:bg-surface enabled:aria-invalid:border-danger/65 enabled:aria-invalid:bg-danger/[0.055] disabled:border-disabled-border disabled:bg-disabled-surface disabled:shadow-none",
  underline:
    "rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none enabled:not-focus-visible:not-aria-invalid:hover:border-foreground/40 focus-visible:border-focus-ring focus-visible:shadow-[0_1px_0_var(--color-focus-ring)] enabled:aria-invalid:border-danger disabled:border-disabled-border disabled:bg-transparent disabled:shadow-none",
})

export type DateTimePickerProps = Omit<JSX.IntrinsicElements["div"], "defaultValue"> & {
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

export function DateTimePicker(props: DateTimePickerProps) {
  const [local, rest] = splitProps(
    mergeProps(
      {
        defaultTime: "09:00",
        disabled: false,
        hourCycle: "h23",
        placeholder: "Choose a date and time",
        timeStep: 30,
      } as const,
      props
    ),
    [
      "class",
      "defaultMonth",
      "defaultTime",
      "defaultValue",
      "disabled",
      "disabledDates",
      "form",
      "hourCycle",
      "locale",
      "max",
      "min",
      "month",
      "name",
      "onMonthChange",
      "onValueChange",
      "placeholder",
      "timeStep",
      "today",
      "value",
      "weekStartsOn",
    ]
  )

  const elementRef = createMutableRef<HTMLDivElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLDivElement, [])
  const controllerRef = createMutableRef<DateTimePickerController>(null)
  const initialValue = isLocalDateTime(local.value)
    ? local.value
    : isLocalDateTime(local.defaultValue)
      ? local.defaultValue
      : null
  const initialDate = initialValue?.slice(0, 10)
  const initialTime = initialValue?.slice(11, 16) ?? local.defaultTime
  const minDate = isLocalDateTime(local.min) ? local.min.slice(0, 10) : undefined
  const maxDate = isLocalDateTime(local.max) ? local.max.slice(0, 10) : undefined

  onMountEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectDateTimePicker(element)
    controllerRef.current = controller

    const handleValueChange = (event: Event) => {
      const nextValue = (event as CustomEvent<DateTimePickerValueChangeDetail>).detail.value
      local.onValueChange?.(nextValue)
      if (local.value !== undefined) {
        queueMicrotask(() => controller.setValue(local.value ?? null))
      }
    }

    element.addEventListener(DATE_TIME_PICKER_VALUE_CHANGE_EVENT, handleValueChange)
    return () => {
      element.removeEventListener(DATE_TIME_PICKER_VALUE_CHANGE_EVENT, handleValueChange)
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
    () => [
      local.defaultTime,
      local.hourCycle,
      local.locale,
      local.max,
      local.min,
      local.placeholder,
      local.value,
    ]
  )

  return (
    <div
      {...rest}
      ref={elementRef}
      data-default-time={local.defaultTime}
      data-hour-cycle={local.hourCycle}
      data-initial-value={JSON.stringify(initialValue)}
      data-locale={local.locale}
      data-max={local.max}
      data-min={local.min}
      data-placeholder={local.placeholder}
      data-slot="date-time-picker"
      class={cn("relative inline-grid min-w-0", local.class)}
    >
      <button
        type="button"
        data-control
        aria-invalid={rest["aria-invalid"]}
        disabled={local.disabled}
        aria-expanded="false"
        aria-haspopup="dialog"
        data-slot="date-time-picker-trigger"
        class={cn(
          "flex w-full min-w-0 appearance-none items-center justify-between gap-3 text-left font-normal text-foreground antialiased transition-[background-color,border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none disabled:cursor-not-allowed disabled:text-disabled-foreground disabled:placeholder:text-disabled-foreground [&>svg]:shrink-0",
          $size("md"),
          $variant("outline")
        )}
      >
        <span
          data-slot="date-time-picker-value"
          data-state={initialValue ? "value" : "placeholder"}
          class="min-w-0 flex-1 overflow-hidden text-ellipsis data-[state=placeholder]:text-muted-foreground"
        >
          {initialValue
            ? formatLocalDateTime(initialValue, local.locale, local.hourCycle)
            : local.placeholder}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          class="size-4 text-muted-foreground"
        >
          <path
            d="M3.25 4.75h9.5M5 2.5v3M11 2.5v3M3 7.25h10v5.25H3z"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10.75 9v1.75l1 1"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <input
        type="hidden"
        disabled={local.disabled}
        form={local.form}
        name={local.name}
        data-slot="date-time-picker-input"
        value={initialValue ?? ""}
      />

      <Popover
        role="dialog"
        placement="bottom-start"
        data-date-time-picker-popover=""
        data-slot="date-time-picker-popover"
        class="max-h-[calc(100dvh-1rem)] max-w-[calc(100vw-1rem)] overflow-visible p-0"
      >
        <Calendar
          defaultMonth={local.defaultMonth}
          defaultValue={initialDate}
          disabledDates={local.disabledDates}
          locale={local.locale}
          max={maxDate}
          min={minDate}
          month={local.month}
          onMonthChange={local.onMonthChange}
          today={local.today}
          weekStartsOn={local.weekStartsOn}
          class="rounded-b-none"
        />

        <div class="flex items-end gap-2 border-t border-border/80 bg-foreground/[0.025] p-3">
          <div class="grid min-w-0 flex-1 gap-1.5">
            <span class="text-[0.6875rem] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
              Time
            </span>
            <TimePicker
              defaultValue={initialTime}
              hourCycle={local.hourCycle}
              locale={local.locale}
              step={local.timeStep}
              class="[&_[data-slot=time-picker-trigger]]:w-full"
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
