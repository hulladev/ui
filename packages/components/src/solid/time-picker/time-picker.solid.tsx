import { createMutableRef, exposeRef, createLifecycleEffect, onMountEffect } from "@/lib/solid"
import { mergeProps, splitProps, type JSX } from "solid-js"
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
import { Button } from "../button/button.solid"
import { InputGroup } from "../input/input-group.solid"
import { Popover } from "../popover/popover.solid"

export type TimePickerProps = Omit<JSX.IntrinsicElements["div"], "defaultValue"> & {
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

export function TimePicker(props: TimePickerProps) {
  const [local, rest] = splitProps(
    mergeProps(
      { disabled: false, hourCycle: "h23", placeholder: "Choose a time", step: 30 } as const,
      props
    ),
    [
      "class",
      "defaultValue",
      "disabled",
      "form",
      "hourCycle",
      "locale",
      "max",
      "min",
      "name",
      "onValueChange",
      "placeholder",
      "step",
      "value",
    ]
  )

  const elementRef = createMutableRef<HTMLDivElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLDivElement, [])
  const controllerRef = createMutableRef<TimePickerController>(null)
  const candidate = local.value ?? local.defaultValue
  const initialValue =
    isTimeValue(candidate) && timeWithinBounds(candidate, local.min, local.max) ? candidate : null
  const options = createTimeOptions({
    hourCycle: local.hourCycle,
    locale: local.locale,
    max: local.max,
    min: local.min,
    step: local.step,
    value: initialValue,
  })
  const draftValue = initialValue ?? options[0]?.value ?? "00:00"
  const draftParts = timeValueParts(draftValue, local.locale, local.hourCycle)
  const twelveHour = local.hourCycle === "h11" || local.hourCycle === "h12"
  const initialPeriod = Number(draftValue.slice(0, 2)) < 12 ? "am" : "pm"

  onMountEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectTimePicker(element)
    controllerRef.current = controller

    const handleValueChange = (event: Event) => {
      const nextValue = (event as CustomEvent<TimePickerValueChangeDetail>).detail.value
      local.onValueChange?.(nextValue)
      if (local.value !== undefined) {
        queueMicrotask(() => controller.setValue(local.value ?? null))
      }
    }

    element.addEventListener(TIME_PICKER_VALUE_CHANGE_EVENT, handleValueChange)
    return () => {
      element.removeEventListener(TIME_PICKER_VALUE_CHANGE_EVENT, handleValueChange)
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
      local.hourCycle,
      local.locale,
      local.max,
      local.min,
      local.placeholder,
      local.step,
      local.value,
    ]
  )

  return (
    <div
      {...rest}
      ref={elementRef}
      data-hour-cycle={local.hourCycle}
      data-initial-value={JSON.stringify(initialValue)}
      data-locale={local.locale}
      data-max={local.max}
      data-min={local.min}
      data-options={JSON.stringify(options.map((option) => option.value))}
      data-placeholder={local.placeholder}
      data-slot="time-picker"
      data-step={local.step}
      class={cn("relative inline-grid min-w-0", local.class)}
    >
      <Button
        variant="outline"
        disabled={local.disabled}
        aria-expanded="false"
        aria-haspopup="dialog"
        data-slot="time-picker-trigger"
        class="min-w-48 justify-between gap-3 bg-surface px-3 text-left font-normal shadow-xs"
      >
        <span
          data-slot="time-picker-value"
          data-state={initialValue ? "value" : "placeholder"}
          class="min-w-0 flex-1 overflow-hidden text-ellipsis tabular-nums data-[state=placeholder]:text-muted-foreground"
        >
          {initialValue
            ? formatTimeValue(initialValue, local.locale, local.hourCycle)
            : local.placeholder}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          class="size-4 text-muted-foreground"
        >
          <circle cx="8" cy="8" r="5.5" stroke="currentColor" stroke-width="1.25" />
          <path
            d="M8 4.75V8l2.25 1.5"
            stroke="currentColor"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </Button>

      <input
        type="hidden"
        disabled={local.disabled}
        form={local.form}
        name={local.name}
        data-slot="time-picker-input"
        value={initialValue ?? ""}
      />

      <Popover
        role="dialog"
        placement="bottom-start"
        data-time-picker-popover=""
        data-slot="time-picker-popover"
        class="w-64 max-w-[calc(100vw-1rem)] overflow-hidden p-3"
      >
        <div class="mb-2.5 flex items-baseline justify-between gap-3">
          <span class="text-xs font-semibold text-foreground">Set time</span>
          <span class="text-[0.625rem] tabular-nums text-muted-foreground">
            {Math.max(1, Math.floor(local.step))} min increments
          </span>
        </div>

        <div
          role="group"
          aria-label={`Choose a time, ${formatTimeValue(draftValue, local.locale, local.hourCycle)}`}
          tabindex={0}
          data-slot="time-picker-controls"
          data-invalid="false"
          class="grid gap-2 outline-none"
        >
          <InputGroup
            controlSize="lg"
            class="h-auto min-h-16 items-stretch overflow-visible p-0 has-[[aria-invalid=true]]:border-danger"
          >
            <div
              data-slot="time-picker-part"
              data-time-picker-part="hour"
              data-active="true"
              class="flex min-w-0 flex-1 items-center gap-1 px-3 py-2 transition-colors data-[active=true]:bg-foreground/[0.025]"
            >
              <label class="grid min-w-0 flex-1 gap-0.5">
                <span class="text-[0.5625rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  Hour
                </span>
                <input
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength={2}
                  autocomplete="off"
                  aria-label="Hour"
                  aria-invalid="false"
                  data-slot="time-picker-hour"
                  value={draftParts.hour}
                  class="h-7 w-full min-w-0 border-0 bg-transparent p-0 font-mono text-xl leading-none font-semibold tracking-[-0.05em] tabular-nums text-foreground outline-none selection:bg-primary selection:text-primary-foreground aria-invalid:text-danger"
                />
              </label>
              <div class="grid shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Increase hour"
                  data-time-picker-action="increment"
                  data-time-picker-part="hour"
                  class="size-6 rounded-sm border-transparent p-0 shadow-none"
                >
                  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" class="size-3">
                    <path
                      d="m4.5 9.5 3.5-3 3.5 3"
                      stroke="currentColor"
                      stroke-width="1.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Decrease hour"
                  data-time-picker-action="decrement"
                  data-time-picker-part="hour"
                  class="size-6 rounded-sm border-transparent p-0 shadow-none"
                >
                  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" class="size-3">
                    <path
                      d="m4.5 6.5 3.5 3 3.5-3"
                      stroke="currentColor"
                      stroke-width="1.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </Button>
              </div>
            </div>

            <span aria-hidden="true" class="self-stretch border-l border-border/70" />

            <div
              data-slot="time-picker-part"
              data-time-picker-part="minute"
              data-active="false"
              class="flex min-w-0 flex-1 items-center gap-1 px-3 py-2 transition-colors data-[active=true]:bg-foreground/[0.025]"
            >
              <label class="grid min-w-0 flex-1 gap-0.5">
                <span class="text-[0.5625rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                  Minute
                </span>
                <input
                  type="text"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength={2}
                  autocomplete="off"
                  aria-label="Minute"
                  aria-invalid="false"
                  data-slot="time-picker-minute"
                  value={draftParts.minute}
                  class="h-7 w-full min-w-0 border-0 bg-transparent p-0 font-mono text-xl leading-none font-semibold tracking-[-0.05em] tabular-nums text-foreground outline-none selection:bg-primary selection:text-primary-foreground aria-invalid:text-danger"
                />
              </label>
              <div class="grid shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Increase minute"
                  data-time-picker-action="increment"
                  data-time-picker-part="minute"
                  class="size-6 rounded-sm border-transparent p-0 shadow-none"
                >
                  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" class="size-3">
                    <path
                      d="m4.5 9.5 3.5-3 3.5 3"
                      stroke="currentColor"
                      stroke-width="1.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Decrease minute"
                  data-time-picker-action="decrement"
                  data-time-picker-part="minute"
                  class="size-6 rounded-sm border-transparent p-0 shadow-none"
                >
                  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" class="size-3">
                    <path
                      d="m4.5 6.5 3.5 3 3.5-3"
                      stroke="currentColor"
                      stroke-width="1.4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
              class="grid grid-cols-2 gap-1 rounded-md bg-foreground/[0.045] p-1 data-[active=true]:ring-1 data-[active=true]:ring-border"
            >
              <Button
                variant="outline"
                size="sm"
                aria-pressed={initialPeriod === "am"}
                data-time-picker-action="period"
                data-time-picker-part="period"
                data-period="am"
                data-state={initialPeriod === "am" ? "selected" : "idle"}
                class="h-7 border-transparent px-2 text-[0.6875rem] shadow-none data-[state=selected]:border-border data-[state=selected]:bg-surface data-[state=selected]:shadow-xs"
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
                class="h-7 border-transparent px-2 text-[0.6875rem] shadow-none data-[state=selected]:border-border data-[state=selected]:bg-surface data-[state=selected]:shadow-xs"
              >
                PM
              </Button>
            </div>
          )}
          <div class="mt-1 flex items-center justify-between gap-3">
            <span
              role="status"
              aria-live="polite"
              data-slot="time-picker-hint"
              data-state="idle"
              class="text-[0.625rem] text-muted-foreground data-[state=invalid]:font-medium data-[state=invalid]:text-danger"
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
