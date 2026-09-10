import { vn, cn } from "@/lib/style"
import { mergeProps, splitProps, type JSX } from "solid-js"
import { createMutableRef, exposeRef, createLifecycleEffect } from "@/lib/solid"
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
import { Calendar } from "../calendar/calendar"
import { Popover } from "../popover/popover"

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

type DatePickerBaseProps = Omit<JSX.IntrinsicElements["div"], "defaultValue"> & {
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
  const [local, selectionRest] = splitProps(
    mergeProps({ disabled: false, selectionMode: "single" } as const, props),
    [
      "class",
      "defaultMonth",
      "defaultValue",
      "disabled",
      "disabledDates",
      "locale",
      "max",
      "min",
      "month",
      "onMonthChange",
      "onValueChange",
      "placeholder",
      "selectionMode",
      "today",
      "value",
      "weekStartsOn",
    ]
  )
  const [selection, rest] = splitProps(
    selectionRest as JSX.IntrinsicElements["div"] & {
      endName?: string
      form?: string
      name?: string
      startName?: string
    },
    ["endName", "form", "name", "startName"]
  )
  const elementRef = createMutableRef<HTMLDivElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLDivElement)
  const controllerRef = createMutableRef<DatePickerController>(null)

  const initialValue = (local.value ?? local.defaultValue ?? null) as CalendarValue
  const fallback =
    local.placeholder ?? (local.selectionMode === "range" ? "Choose a date range" : "Choose a date")
  const formattedValue = formatCalendarValue(initialValue, local.selectionMode, local.locale)

  createLifecycleEffect(
    () => {
      const element = elementRef.current
      if (!element) return

      const controller = connectDatePicker(element)
      controllerRef.current = controller

      const handleValueChange = (event: Event) => {
        const nextValue = (event as CustomEvent<DatePickerValueChangeDetail>).detail.value
        if (local.selectionMode === "range") {
          ;(local.onValueChange as RangeDatePickerProps["onValueChange"])?.(
            nextValue && typeof nextValue !== "string" ? nextValue : null
          )
        } else {
          ;(local.onValueChange as SingleDatePickerProps["onValueChange"])?.(
            typeof nextValue === "string" ? nextValue : null
          )
        }

        if (local.value !== undefined) {
          queueMicrotask(() => controller.setValue(local.value ?? null))
        }
      }

      element.addEventListener(DATE_PICKER_VALUE_CHANGE_EVENT, handleValueChange)
      return () => {
        element.removeEventListener(DATE_PICKER_VALUE_CHANGE_EVENT, handleValueChange)
        controller.destroy()
        controllerRef.current = null
      }
    },
    () => [local.selectionMode]
  )

  createLifecycleEffect(
    () => {
      const controller = controllerRef.current
      if (!controller) return
      controller.refresh()
      if (local.value !== undefined) controller.setValue(local.value)
    },
    () => [local.locale, local.placeholder, local.selectionMode, local.value]
  )

  return (
    <div
      {...rest}
      ref={elementRef}
      data-initial-value={serializeCalendarValue(initialValue)}
      data-locale={local.locale}
      data-placeholder={local.placeholder}
      data-selection-mode={local.selectionMode}
      data-slot="date-picker"
      class={cn("relative inline-grid min-w-0", local.class)}
    >
      <button
        type="button"
        data-control
        aria-invalid={rest["aria-invalid"]}
        disabled={local.disabled}
        aria-expanded="false"
        aria-haspopup="dialog"
        data-slot="date-picker-trigger"
        class={cn(
          "flex w-full min-w-0 appearance-none items-center justify-between gap-3 text-left font-normal text-foreground antialiased transition-[background-color,border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none disabled:cursor-not-allowed disabled:text-disabled-foreground disabled:placeholder:text-disabled-foreground [&>svg]:shrink-0",
          $size("md"),
          $variant("outline")
        )}
      >
        <span
          data-slot="date-picker-value"
          data-state={formattedValue ? "value" : "placeholder"}
          class="min-w-0 flex-1 overflow-hidden text-ellipsis data-[state=placeholder]:text-muted-foreground"
        >
          {formattedValue || fallback}
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
        </svg>
      </button>

      {local.selectionMode === "range" ? (
        <>
          <input
            type="hidden"
            disabled={local.disabled}
            form={selection.form}
            name={selection.startName}
            data-slot="date-picker-start-input"
            value={initialValue && typeof initialValue !== "string" ? initialValue.start : ""}
          />
          <input
            type="hidden"
            disabled={local.disabled}
            form={selection.form}
            name={selection.endName}
            data-slot="date-picker-end-input"
            value={initialValue && typeof initialValue !== "string" ? (initialValue.end ?? "") : ""}
          />
        </>
      ) : (
        <input
          type="hidden"
          disabled={local.disabled}
          form={selection.form}
          name={selection.name}
          data-slot="date-picker-input"
          value={typeof initialValue === "string" ? initialValue : ""}
        />
      )}

      <Popover
        role="dialog"
        placement="bottom-start"
        data-date-picker-popover=""
        data-slot="date-picker-popover"
        class="max-h-[calc(100dvh-1rem)] max-w-[calc(100vw-1rem)] overflow-visible p-0"
      >
        {local.selectionMode === "range" ? (
          <Calendar
            defaultMonth={local.defaultMonth}
            defaultValue={initialValue && typeof initialValue !== "string" ? initialValue : null}
            disabledDates={local.disabledDates}
            locale={local.locale}
            max={local.max}
            min={local.min}
            month={local.month}
            onMonthChange={local.onMonthChange}
            selectionMode="range"
            today={local.today}
            weekStartsOn={local.weekStartsOn}
          />
        ) : (
          <Calendar
            defaultMonth={local.defaultMonth}
            defaultValue={typeof initialValue === "string" ? initialValue : null}
            disabledDates={local.disabledDates}
            locale={local.locale}
            max={local.max}
            min={local.min}
            month={local.month}
            onMonthChange={local.onMonthChange}
            today={local.today}
            weekStartsOn={local.weekStartsOn}
          />
        )}
      </Popover>
    </div>
  )
}
