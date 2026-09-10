import { formControlSizes, formControlVariants } from "@/+css/form-control.css"
import { resolve } from "@hulla/ui"
import { cn } from "@/lib/style"
import {
  connectTimePicker,
  createTimeOptions,
  formatTimeValue,
  isTimeValue,
  timeValueParts,
  timeWithinBounds,
  TIME_PICKER_VALUE_CHANGE_EVENT,
  type TimePickerController,
  type TimePickerValueChangeDetail,
} from "@/lib/time-picker"
import { useEffect, useImperativeHandle, useRef, type ComponentPropsWithRef } from "react"
import { Button } from "../button/button.react"
import { InputGroup } from "../input/input-group.react"
import { Popover } from "../popover/popover.react"

const $size = resolve(formControlSizes)
const $variant = resolve(formControlVariants)

export type TimePickerProps = Omit<ComponentPropsWithRef<"div">, "defaultValue"> & {
  defaultValue?: string | null
  disabled?: boolean
  form?: string
  hourCycle?: "h11" | "h12" | "h23" | "h24"
  locale?: string
  max?: string
  min?: string
  name?: string
  onValueChange?: (value: string | null) => void
  placeholder?: string
  step?: number
  value?: string | null
}

export function TimePicker({
  className,
  defaultValue,
  disabled = false,
  form,
  hourCycle = "h23",
  locale,
  max,
  min,
  name,
  onValueChange,
  placeholder = "Choose a time",
  step = 30,
  value,
  ...props
}: TimePickerProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLDivElement, [])
  const controllerRef = useRef<TimePickerController>(null)
  const valueRef = useRef(value)
  const onValueChangeRef = useRef(onValueChange)
  valueRef.current = value
  onValueChangeRef.current = onValueChange

  const candidate = value ?? defaultValue
  const initialValue =
    isTimeValue(candidate) && timeWithinBounds(candidate, min, max) ? candidate : null
  const options = createTimeOptions({
    hourCycle,
    locale,
    max,
    min,
    step,
    value: initialValue,
  })
  const draftValue = initialValue ?? options[0]?.value ?? "00:00"
  const draftParts = timeValueParts(draftValue, locale, hourCycle)
  const twelveHour = hourCycle === "h11" || hourCycle === "h12"
  const initialPeriod = Number(draftValue.slice(0, 2)) < 12 ? "am" : "pm"

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectTimePicker(element)
    controllerRef.current = controller

    const handleValueChange = (event: Event) => {
      const nextValue = (event as CustomEvent<TimePickerValueChangeDetail>).detail.value
      onValueChangeRef.current?.(nextValue)
      if (valueRef.current !== undefined) {
        queueMicrotask(() => controller.setValue(valueRef.current ?? null))
      }
    }

    element.addEventListener(TIME_PICKER_VALUE_CHANGE_EVENT, handleValueChange)
    return () => {
      element.removeEventListener(TIME_PICKER_VALUE_CHANGE_EVENT, handleValueChange)
      controller.destroy()
      controllerRef.current = null
    }
  }, [])

  useEffect(() => {
    const controller = controllerRef.current
    if (!controller) return
    controller.refresh()
    if (value !== undefined) controller.setValue(value)
  }, [hourCycle, locale, max, min, placeholder, step, value])

  return (
    <div
      {...props}
      ref={elementRef}
      data-hour-cycle={hourCycle}
      data-initial-value={JSON.stringify(initialValue)}
      data-locale={locale}
      data-max={max}
      data-min={min}
      data-options={JSON.stringify(options.map((option) => option.value))}
      data-placeholder={placeholder}
      data-slot="time-picker"
      data-step={step}
      className={cn("relative inline-grid min-w-0", className)}
    >
      <button
        type="button"
        data-control
        aria-invalid={props["aria-invalid"]}
        disabled={disabled}
        aria-expanded="false"
        aria-haspopup="dialog"
        data-slot="time-picker-trigger"
        className={cn(
          "flex w-full min-w-0 appearance-none items-center justify-between gap-3 text-left font-normal text-foreground antialiased transition-[background-color,border-color,box-shadow,color] duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none disabled:cursor-not-allowed disabled:text-disabled-foreground [&>svg]:shrink-0",
          $size("md"),
          $variant("outline")
        )}
      >
        <span
          data-slot="time-picker-value"
          data-state={initialValue ? "value" : "placeholder"}
          className="min-w-0 flex-1 overflow-hidden text-ellipsis tabular-nums data-[state=placeholder]:text-muted-foreground"
        >
          {initialValue ? formatTimeValue(initialValue, locale, hourCycle) : placeholder}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          className="size-4 text-muted-foreground"
        >
          <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.25" />
          <path
            d="M8 4.75V8l2.25 1.5"
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
        data-slot="time-picker-input"
        defaultValue={initialValue ?? ""}
      />

      <Popover
        role="dialog"
        placement="bottom-start"
        data-time-picker-popover=""
        data-slot="time-picker-popover"
        className="w-64 max-w-[calc(100vw-1rem)] overflow-hidden p-3"
      >
        <div className="mb-2.5 flex items-baseline justify-between gap-3">
          <span className="text-xs font-semibold text-foreground">Set time</span>
          <span className="text-[0.625rem] tabular-nums text-muted-foreground">
            {Math.max(1, Math.floor(step))} min increments
          </span>
        </div>

        <div
          role="group"
          aria-label={`Choose a time, ${formatTimeValue(draftValue, locale, hourCycle)}`}
          tabIndex={0}
          data-slot="time-picker-controls"
          data-invalid="false"
          className="grid gap-2 outline-none"
        >
          <InputGroup
            controlSize="lg"
            className="h-auto min-h-16 items-stretch overflow-visible p-0 has-[[aria-invalid=true]]:border-danger"
          >
            <div
              data-slot="time-picker-part"
              data-time-picker-part="hour"
              data-active="true"
              className="flex min-w-0 flex-1 items-center gap-1 px-3 py-2 transition-colors data-[active=true]:bg-foreground/[0.025]"
            >
              <label className="grid min-w-0 flex-1 gap-0.5">
                <span className="text-[0.5625rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  Hour
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  autoComplete="off"
                  aria-label="Hour"
                  aria-invalid="false"
                  data-slot="time-picker-hour"
                  defaultValue={draftParts.hour}
                  className="h-7 w-full min-w-0 border-0 bg-transparent p-0 font-mono text-xl leading-none font-semibold tracking-[-0.05em] tabular-nums text-foreground outline-none selection:bg-primary selection:text-primary-foreground aria-invalid:text-danger"
                />
              </label>
              <div className="grid shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Increase hour"
                  data-time-picker-action="increment"
                  data-time-picker-part="hour"
                  className="size-6 rounded-sm border-transparent p-0 shadow-none"
                >
                  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-3">
                    <path
                      d="m4.5 9.5 3.5-3 3.5 3"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Decrease hour"
                  data-time-picker-action="decrement"
                  data-time-picker-part="hour"
                  className="size-6 rounded-sm border-transparent p-0 shadow-none"
                >
                  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-3">
                    <path
                      d="m4.5 6.5 3.5 3 3.5-3"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </div>
            </div>

            <span aria-hidden="true" className="self-stretch border-l border-border/70" />

            <div
              data-slot="time-picker-part"
              data-time-picker-part="minute"
              data-active="false"
              className="flex min-w-0 flex-1 items-center gap-1 px-3 py-2 transition-colors data-[active=true]:bg-foreground/[0.025]"
            >
              <label className="grid min-w-0 flex-1 gap-0.5">
                <span className="text-[0.5625rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  Minute
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={2}
                  autoComplete="off"
                  aria-label="Minute"
                  aria-invalid="false"
                  data-slot="time-picker-minute"
                  defaultValue={draftParts.minute}
                  className="h-7 w-full min-w-0 border-0 bg-transparent p-0 font-mono text-xl leading-none font-semibold tracking-[-0.05em] tabular-nums text-foreground outline-none selection:bg-primary selection:text-primary-foreground aria-invalid:text-danger"
                />
              </label>
              <div className="grid shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Increase minute"
                  data-time-picker-action="increment"
                  data-time-picker-part="minute"
                  className="size-6 rounded-sm border-transparent p-0 shadow-none"
                >
                  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-3">
                    <path
                      d="m4.5 9.5 3.5-3 3.5 3"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Decrease minute"
                  data-time-picker-action="decrement"
                  data-time-picker-part="minute"
                  className="size-6 rounded-sm border-transparent p-0 shadow-none"
                >
                  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-3">
                    <path
                      d="m4.5 6.5 3.5 3 3.5-3"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </InputGroup>

          {twelveHour && (
            <div
              data-slot="time-picker-part"
              data-time-picker-part="period"
              data-active="false"
              className="grid grid-cols-2 gap-1 rounded-md bg-foreground/[0.045] p-1 data-[active=true]:ring-1 data-[active=true]:ring-border"
            >
              <Button
                variant="outline"
                size="sm"
                aria-pressed={initialPeriod === "am"}
                data-time-picker-action="period"
                data-time-picker-part="period"
                data-period="am"
                data-state={initialPeriod === "am" ? "selected" : "idle"}
                className="h-7 border-transparent px-2 text-[0.6875rem] shadow-none data-[state=selected]:border-border data-[state=selected]:bg-surface data-[state=selected]:shadow-xs"
              >
                AM
              </Button>
              <Button
                variant="outline"
                size="sm"
                aria-pressed={initialPeriod === "pm"}
                data-time-picker-action="period"
                data-time-picker-part="period"
                data-period="pm"
                data-state={initialPeriod === "pm" ? "selected" : "idle"}
                className="h-7 border-transparent px-2 text-[0.6875rem] shadow-none data-[state=selected]:border-border data-[state=selected]:bg-surface data-[state=selected]:shadow-xs"
              >
                PM
              </Button>
            </div>
          )}
          <div className="mt-1 flex items-center justify-between gap-3">
            <span
              role="status"
              aria-live="polite"
              data-slot="time-picker-hint"
              data-state="idle"
              className="text-[0.625rem] text-muted-foreground data-[state=invalid]:font-medium data-[state=invalid]:text-danger"
            >
              Type or use ↑↓
            </span>
            <Button type="button" variant="primary" size="sm" data-time-picker-action="commit">
              Done
            </Button>
          </div>
        </div>
      </Popover>
    </div>
  )
}
