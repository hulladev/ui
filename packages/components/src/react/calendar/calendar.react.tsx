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
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"

type CalendarBaseProps = Omit<ComponentPropsWithRef<"div">, "defaultValue"> & {
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
  "relative isolate grid h-9 w-full place-items-center border-0 bg-transparent p-0 text-[0.8125rem] font-medium tabular-nums text-foreground transition-[background-color,color,box-shadow,transform] duration-100 ease-out after:pointer-events-none after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-transparent after:content-[''] hover:z-10 hover:bg-foreground/[0.065] active:scale-[0.94] focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus-ring disabled:pointer-events-none disabled:text-muted-foreground/30 disabled:line-through disabled:decoration-current/45 motion-reduce:transition-none data-[outside=true]:text-muted-foreground/45 data-[today=true]:after:bg-primary group-data-[selection-mode=single]/calendar:data-[selected=true]:rounded-md group-data-[selection-mode=single]/calendar:data-[selected=true]:bg-primary group-data-[selection-mode=single]/calendar:data-[selected=true]:text-primary-foreground group-data-[selection-mode=single]/calendar:data-[selected=true]:shadow-sm group-data-[selection-mode=single]/calendar:data-[selected=true]:after:bg-primary-foreground data-[in-range=true]:rounded-none data-[in-range=true]:bg-primary/12 data-[range-preview=true]:rounded-none data-[range-preview=true]:bg-primary/[0.07] data-[range-start=true]:z-10 data-[range-start=true]:rounded-l-md data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-start=true]:shadow-sm data-[range-start=true]:after:bg-primary-foreground data-[range-end=true]:z-10 data-[range-end=true]:rounded-r-md data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-end=true]:shadow-sm data-[range-end=true]:after:bg-primary-foreground data-[range-start=true][data-range-end=true]:rounded-md dark:data-[in-range=true]:bg-primary/18 dark:data-[range-preview=true]:bg-primary/10"

export function Calendar(props: CalendarProps) {
  const {
    "aria-label": ariaLabel = "Calendar",
    className,
    defaultMonth,
    defaultValue,
    disabledDates,
    locale,
    max,
    min,
    month,
    onMonthChange,
    onValueChange,
    selectionMode = "single",
    today,
    value,
    weekStartsOn,
    ...rootProps
  } = props
  const elementRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLDivElement, [])
  const controllerRef = useRef<CalendarController>(null)
  const valueRef = useRef<CalendarValue | undefined>(value)
  const monthRef = useRef(month)
  const onValueChangeRef = useRef(onValueChange)
  const onMonthChangeRef = useRef(onMonthChange)
  valueRef.current = value
  monthRef.current = month
  onValueChangeRef.current = onValueChange
  onMonthChangeRef.current = onMonthChange

  const initialValue = (value ?? defaultValue ?? null) as CalendarValue
  const view = createCalendarView({
    disabledDates,
    locale,
    max,
    min,
    month: month ?? defaultMonth,
    selectionMode,
    today,
    value: initialValue,
    weekStartsOn,
  })
  const selectedDate =
    typeof initialValue === "string" ? initialValue : (initialValue?.start ?? undefined)
  const initialFocus =
    selectedDate ??
    (today?.slice(0, 7) === view.month ? today : undefined) ??
    view.days.find((day) => !day.disabled && !day.outside)?.date ??
    view.days.find((day) => !day.disabled)?.date

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectCalendar(element)
    controllerRef.current = controller

    const handleValueChange = (event: Event) => {
      const nextValue = (event as CustomEvent<CalendarValueChangeDetail>).detail.value
      if (selectionMode === "range") {
        ;(onValueChangeRef.current as RangeCalendarProps["onValueChange"])?.(
          nextValue && typeof nextValue !== "string" ? nextValue : null
        )
      } else {
        ;(onValueChangeRef.current as SingleCalendarProps["onValueChange"])?.(
          typeof nextValue === "string" ? nextValue : null
        )
      }

      if (valueRef.current !== undefined) {
        queueMicrotask(() => controller.setValue(valueRef.current ?? null))
      }
    }

    const handleMonthChange = (event: Event) => {
      const nextMonth = (event as CustomEvent<CalendarMonthChangeDetail>).detail.month
      onMonthChangeRef.current?.(nextMonth)
      if (monthRef.current !== undefined) {
        queueMicrotask(() => controller.setMonth(monthRef.current!))
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
  }, [selectionMode])

  useEffect(() => {
    const controller = controllerRef.current
    if (!controller) return
    controller.refresh()
    if (value !== undefined) controller.setValue(value)
    if (month !== undefined) controller.setMonth(month)
  }, [disabledDates, locale, max, min, month, selectionMode, today, value, weekStartsOn])

  return (
    <div
      {...rootProps}
      ref={elementRef}
      aria-label={ariaLabel}
      data-disabled-dates={disabledDates ? JSON.stringify(disabledDates) : undefined}
      data-initial-value={serializeCalendarValue(initialValue)}
      data-locale={locale}
      data-max={max}
      data-min={min}
      data-month={view.month}
      data-selection-mode={selectionMode}
      data-slot="calendar"
      data-today={today}
      data-week-starts-on={weekStartsOn}
      className={cn(
        "group/calendar block w-[18.5rem] min-w-[18.5rem] select-none rounded-lg bg-surface-raised p-3 text-sm text-foreground antialiased",
        className
      )}
    >
      <div data-slot="calendar-header" className="mb-2 flex h-9 items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Previous month"
          data-slot="calendar-previous"
          className="grid size-8 place-items-center rounded-md border border-transparent bg-transparent text-muted-foreground transition-[background-color,color,transform] duration-100 hover:bg-foreground/[0.06] hover:text-foreground active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus-ring disabled:pointer-events-none disabled:opacity-30 motion-reduce:transition-none"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-4">
            <path
              d="m10 3-5 5 5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          data-slot="calendar-heading"
          aria-live="polite"
          className="min-w-0 flex-1 text-center text-[0.8125rem] font-semibold tracking-[-0.01em]"
        >
          {view.heading}
        </div>

        <button
          type="button"
          aria-label="Next month"
          data-slot="calendar-next"
          className="grid size-8 place-items-center rounded-md border border-transparent bg-transparent text-muted-foreground transition-[background-color,color,transform] duration-100 hover:bg-foreground/[0.06] hover:text-foreground active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus-ring disabled:pointer-events-none disabled:opacity-30 motion-reduce:transition-none"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-4">
            <path
              d="m6 3 5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <table
        role="grid"
        data-slot="calendar-grid"
        className="w-full table-fixed border-separate border-spacing-0"
      >
        <thead>
          <tr>
            {view.weekdays.map((weekday) => (
              <th
                key={weekday.longLabel}
                scope="col"
                aria-label={weekday.longLabel}
                title={weekday.longLabel}
                data-slot="calendar-weekday"
                className="h-7 p-0 text-center text-[0.625rem] font-semibold tracking-[0.08em] text-muted-foreground/75 uppercase"
              >
                {weekday.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, weekIndex) => (
            <tr key={weekIndex}>
              {view.days.slice(weekIndex * 7, weekIndex * 7 + 7).map((day) => (
                <td key={day.date} role="gridcell" className="p-0 text-center">
                  <button
                    type="button"
                    aria-current={day.today ? "date" : undefined}
                    aria-label={day.date}
                    aria-selected={day.selected}
                    disabled={day.disabled}
                    tabIndex={day.date === initialFocus && !day.disabled ? 0 : -1}
                    data-date={day.date}
                    data-in-range={day.inRange ? "true" : undefined}
                    data-outside={day.outside ? "true" : undefined}
                    data-range-end={day.rangeEnd ? "true" : undefined}
                    data-range-start={day.rangeStart ? "true" : undefined}
                    data-selected={day.selected ? "true" : undefined}
                    data-slot="calendar-day"
                    data-today={day.today ? "true" : undefined}
                    className={dayClassName}
                  >
                    {day.day}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
