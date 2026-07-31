import { createMutableRef, createLifecycleEffect, onMountEffect } from "@/lib/solid"
import { createMemo, createSignal, For, mergeProps, splitProps, type JSX } from "solid-js"
import {
  dismissToast,
  getToasts,
  subscribeToasts,
  toastClassNames,
  type ToastPosition,
  type ToastRecord,
} from "@/lib/toast"
import { cn } from "@/lib/style"
import { Portal } from "solid-js/web"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProgress,
  ToastTitle,
} from "./toast.solid"

type ToastItemProps = {
  defaultDuration: number
  record: ToastRecord
}

function ToastItem(props: ToastItemProps) {
  const [local] = splitProps(props, ["defaultDuration", "record"])

  const duration = () => local.record.duration ?? local.defaultDuration
  const [paused, setPaused] = createSignal(false)
  const remainingRef = createMutableRef(duration())
  const startedAtRef = createMutableRef(0)
  const timerRef = createMutableRef<ReturnType<typeof setTimeout>>(undefined)

  const pauseTimer = () => {
    setPaused(true)
    const timer = timerRef.current
    if (timer == null) return
    clearTimeout(timer)
    timerRef.current = undefined
    remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAtRef.current))
  }

  const resumeTimer = () => {
    setPaused(false)
    if (duration() <= 0 || timerRef.current !== undefined) return
    startedAtRef.current = Date.now()
    timerRef.current = setTimeout(() => dismissToast(local.record.id), remainingRef.current)
  }

  createLifecycleEffect(
    () => {
      setPaused(false)
      remainingRef.current = duration()
      resumeTimer()
      return () => {
        const timer = timerRef.current
        if (timer != null) clearTimeout(timer)
      }
    },
    () => [duration(), local.record.id]
  )

  const handleBlur = (event: FocusEvent & { currentTarget: HTMLLIElement }) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) resumeTimer()
  }

  const handlePointerLeave = (event: PointerEvent & { currentTarget: HTMLLIElement }) => {
    if (!event.currentTarget.contains(document.activeElement)) resumeTimer()
  }

  return (
    <Toast
      variant={local.record.variant}
      data-paused={paused()}
      data-toast-id={local.record.id}
      onBlur={handleBlur}
      onFocus={pauseTimer}
      onPointerEnter={pauseTimer}
      onPointerLeave={handlePointerLeave}
    >
      <div class="min-w-0">
        <ToastTitle>{local.record.title}</ToastTitle>
        {local.record.description && (
          <ToastDescription>{local.record.description}</ToastDescription>
        )}
      </div>
      <ToastClose onClick={() => dismissToast(local.record.id)} />
      {local.record.action && (
        <ToastAction
          onClick={() => {
            local.record.action?.onClick?.()
            dismissToast(local.record.id)
          }}
        >
          {local.record.action.label}
        </ToastAction>
      )}
      <ToastProgress duration={duration()} />
    </Toast>
  )
}

export type ToasterProps = Omit<JSX.IntrinsicElements["ol"], "children"> & {
  duration?: number
  limit?: number
  position?: ToastPosition
}

export function Toaster(props: ToasterProps) {
  const [local, rest] = splitProps(
    mergeProps(
      {
        "aria-label": "Notifications",
        duration: 5000,
        limit: 4,
        position: "bottom-right",
      } as const,
      props
    ),
    ["aria-label", "class", "duration", "limit", "position"]
  )

  const [records, setRecords] = createSignal<readonly ToastRecord[]>(getToasts())
  const visibleRecords = createMemo(() => records().slice(0, Math.max(1, local.limit)))
  onMountEffect(() => subscribeToasts(setRecords))

  return (
    <Portal>
      <ol
        {...rest}
        aria-label={local["aria-label"]}
        data-position={local.position}
        data-slot="toast-viewport"
        class={cn(toastClassNames.viewport, local.class)}
      >
        <For each={visibleRecords()}>
          {(record) => <ToastItem defaultDuration={local.duration} record={record} />}
        </For>
      </ol>
    </Portal>
  )
}
