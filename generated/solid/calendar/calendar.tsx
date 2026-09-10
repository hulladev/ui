import { For, mergeProps, splitProps, type JSX } from "solid-js"
import { createMutableRef, exposeRef, createLifecycleEffect } from "@/lib/solid"
import {
  CALENDAR_MONTH_CHANGE_EVENT,
  CALENDAR_VALUE_CHANGE_EVENT,
  connectCalendar,
  createCalendarView,
  serializeCalendarValue,
  type CalendarController,
  type CalendarDateRange,
  type CalendarDisabledDate,
  type CalendarMonthChangeDetail,
  type CalendarValue,
  type CalendarValueChangeDetail,
} from "@/lib/calendar"
import { cn } from "@/lib/style"

type CalendarBaseProps = Omit<JSX.IntrinsicElements["div"], "defaultValue"> & {
  defaultMonth?: string
  disabledDates?: readonly CalendarDisabledDate[]
  locale?: string
  max?: string
  min?: string
  month?: string
  onMonthChange?: (month: string) => void
  today?: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

type SingleCalendarProps = {
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  selectionMode?: "single"
  value?: string | null
}

type RangeCalendarProps = {
  defaultValue?: CalendarDateRange | null
  onValueChange?: (value: CalendarDateRange | null) => void
  selectionMode: "range"
  value?: CalendarDateRange | null
}

export type CalendarProps = CalendarBaseProps & (SingleCalendarProps | RangeCalendarProps)

const dayClassName =
  "relative isolate grid h-9 w-full place-items-center border-0 bg-transparent p-0 text-[0.8125rem] font-medium tabular-nums text-foreground transition-[background-color,color,box-shadow,transform] duration-100 ease-out after:pointer-events-none after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-transparent after:content-[''] hover:z-10 hover:bg-foreground/[0.065] active:scale-[0.94] focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring disabled:pointer-events-none disabled:text-muted-foreground disabled:line-through disabled:decoration-current/45 motion-reduce:transition-none data-[outside=true]:text-muted-foreground data-[today=true]:after:bg-primary group-data-[selection-mode=single]/calendar:data-[selected=true]:rounded-md group-data-[selection-mode=single]/calendar:data-[selected=true]:bg-primary group-data-[selection-mode=single]/calendar:data-[selected=true]:text-primary-foreground group-data-[selection-mode=single]/calendar:data-[selected=true]:shadow-sm group-data-[selection-mode=single]/calendar:data-[selected=true]:after:bg-primary-foreground data-[in-range=true]:rounded-none data-[in-range=true]:bg-primary/12 data-[range-preview=true]:rounded-none data-[range-preview=true]:bg-primary/[0.07] data-[range-start=true]:z-10 data-[range-start=true]:rounded-l-md data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-start=true]:shadow-sm data-[range-start=true]:after:bg-primary-foreground data-[range-end=true]:z-10 data-[range-end=true]:rounded-r-md data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-end=true]:shadow-sm data-[range-end=true]:after:bg-primary-foreground data-[range-start=true][data-range-end=true]:rounded-md dark:data-[in-range=true]:bg-primary/18 dark:data-[range-preview=true]:bg-primary/10"

export function Calendar(props: CalendarProps) {
  const [local, rest] = splitProps(
    mergeProps({ "aria-label": "Calendar", selectionMode: "single" } as const, props),
    [
      "aria-label",
      "class",
      "defaultMonth",
      "defaultValue",
      "disabledDates",
      "locale",
      "max",
      "min",
      "month",
      "onMonthChange",
      "onValueChange",
      "selectionMode",
      "today",
      "value",
      "weekStartsOn",
    ]
  )
  const elementRef = createMutableRef<HTMLDivElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLDivElement)
  const controllerRef = createMutableRef<CalendarController>(null)

  const initialValue = (local.value ?? local.defaultValue ?? null) as CalendarValue
  const view = createCalendarView({
    disabledDates: local.disabledDates,
    locale: local.locale,
    max: local.max,
    min: local.min,
    month: local.month ?? local.defaultMonth,
    selectionMode: local.selectionMode,
    today: local.today,
    value: initialValue,
    weekStartsOn: local.weekStartsOn,
  })
  const selectedDate =
    typeof initialValue === "string" ? initialValue : (initialValue?.start ?? undefined)
  const initialFocus =
    selectedDate ??
    (local.today?.slice(0, 7) === view.month ? local.today : undefined) ??
    view.days.find((day) => !day.disabled && !day.outside)?.date ??
    view.days.find((day) => !day.disabled)?.date

  createLifecycleEffect(
    () => {
      const element = elementRef.current
      if (!element) return

      const controller = connectCalendar(element)
      controllerRef.current = controller

      const handleValueChange = (event: Event) => {
        const nextValue = (event as CustomEvent<CalendarValueChangeDetail>).detail.value
        if (local.selectionMode === "range") {
          ;(local.onValueChange as RangeCalendarProps["onValueChange"])?.(
            nextValue && typeof nextValue !== "string" ? nextValue : null
          )
        } else {
          ;(local.onValueChange as SingleCalendarProps["onValueChange"])?.(
            typeof nextValue === "string" ? nextValue : null
          )
        }

        if (local.value !== undefined) {
          queueMicrotask(() => controller.setValue(local.value ?? null))
        }
      }

      const handleMonthChange = (event: Event) => {
        const nextMonth = (event as CustomEvent<CalendarMonthChangeDetail>).detail.month
        local.onMonthChange?.(nextMonth)
        if (local.month !== undefined) {
          queueMicrotask(() => controller.setMonth(local.month!))
        }
      }

      element.addEventListener(CALENDAR_VALUE_CHANGE_EVENT, handleValueChange)
      element.addEventListener(CALENDAR_MONTH_CHANGE_EVENT, handleMonthChange)

      return () => {
        element.removeEventListener(CALENDAR_VALUE_CHANGE_EVENT, handleValueChange)
        element.removeEventListener(CALENDAR_MONTH_CHANGE_EVENT, handleMonthChange)
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
      if (local.month !== undefined) controller.setMonth(local.month)
    },
    () => [
      local.disabledDates,
      local.locale,
      local.max,
      local.min,
      local.month,
      local.selectionMode,
      local.today,
      local.value,
      local.weekStartsOn,
    ]
  )

  return (
    <div
      {...rest}
      ref={elementRef}
      aria-label={local["aria-label"]}
      data-disabled-dates={local.disabledDates ? JSON.stringify(local.disabledDates) : undefined}
      data-initial-value={serializeCalendarValue(initialValue)}
      data-locale={local.locale}
      data-max={local.max}
      data-min={local.min}
      data-month={view.month}
      data-selection-mode={local.selectionMode}
      data-slot="calendar"
      data-today={local.today}
      data-week-starts-on={local.weekStartsOn}
      class={cn(
        "group/calendar block w-[18.5rem] min-w-[18.5rem] select-none rounded-lg bg-surface-raised p-3 text-sm text-foreground antialiased",
        local.class
      )}
    >
      <div data-slot="calendar-header" class="mb-2 flex h-9 items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Previous month"
          data-slot="calendar-previous"
          class="grid size-8 place-items-center rounded-md border border-transparent bg-transparent text-muted-foreground transition-[background-color,color,transform] duration-100 enabled:hover:bg-hover-surface enabled:hover:text-foreground enabled:active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:text-disabled-foreground motion-reduce:transition-none"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" class="size-4">
            <path
              d="m10 3-5 5 5 5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div
          data-slot="calendar-heading"
          aria-live="polite"
          class="min-w-0 flex-1 text-center text-[0.8125rem] font-semibold tracking-[-0.01em]"
        >
          {view.heading}
        </div>

        <button
          type="button"
          aria-label="Next month"
          data-slot="calendar-next"
          class="grid size-8 place-items-center rounded-md border border-transparent bg-transparent text-muted-foreground transition-[background-color,color,transform] duration-100 enabled:hover:bg-hover-surface enabled:hover:text-foreground enabled:active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus-ring disabled:cursor-not-allowed disabled:text-disabled-foreground motion-reduce:transition-none"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" class="size-4">
            <path
              d="m6 3 5 5-5 5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <table
        role="grid"
        data-slot="calendar-grid"
        class="w-full table-fixed border-separate border-spacing-0"
      >
        <thead>
          <tr>
            <For each={view.weekdays}>
              {(weekday) => (
                <th
                  scope="col"
                  aria-label={weekday.longLabel}
                  title={weekday.longLabel}
                  data-slot="calendar-weekday"
                  class="h-7 p-0 text-center text-xs font-medium tracking-[0.02em] text-muted-foreground uppercase"
                >
                  {weekday.label}
                </th>
              )}
            </For>
          </tr>
        </thead>
        <tbody>
          <For each={Array.from({ length: 6 })}>
            {(_, weekIndex) => (
              <tr>
                <For each={view.days.slice(weekIndex() * 7, weekIndex() * 7 + 7)}>
                  {(day) => (
                    <td role="gridcell" class="p-0 text-center">
                      <button
                        type="button"
                        aria-current={day.today ? "date" : undefined}
                        aria-label={day.date}
                        aria-selected={day.selected}
                        disabled={day.disabled}
                        tabindex={day.date === initialFocus && !day.disabled ? 0 : -1}
                        data-date={day.date}
                        data-in-range={day.inRange ? "true" : undefined}
                        data-outside={day.outside ? "true" : undefined}
                        data-range-end={day.rangeEnd ? "true" : undefined}
                        data-range-start={day.rangeStart ? "true" : undefined}
                        data-selected={day.selected ? "true" : undefined}
                        data-slot="calendar-day"
                        data-today={day.today ? "true" : undefined}
                        class={dayClassName}
                      >
                        {day.day}
                      </button>
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  )
}
