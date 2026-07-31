import {
  dismissToast,
  getToasts,
  subscribeToasts,
  toastClassNames,
  type ToastPosition,
  type ToastRecord,
} from "@/lib/toast"
import { cn } from "@/lib/style"
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentPropsWithRef,
  type FocusEvent,
  type PointerEvent,
} from "react"
import { createPortal } from "react-dom"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProgress,
  ToastTitle,
} from "./toast.react"

const emptyServerSnapshot: readonly ToastRecord[] = []

type ToastItemProps = {
  defaultDuration: number
  record: ToastRecord
}

function ToastItem({ defaultDuration, record }: ToastItemProps) {
  const duration = record.duration ?? defaultDuration
  const [paused, setPaused] = useState(false)
  const remainingRef = useRef(duration)
  const startedAtRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const pauseTimer = () => {
    setPaused(true)
    if (timerRef.current === undefined) return
    clearTimeout(timerRef.current)
    timerRef.current = undefined
    remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAtRef.current))
  }

  const resumeTimer = () => {
    setPaused(false)
    if (duration <= 0 || timerRef.current !== undefined) return
    startedAtRef.current = Date.now()
    timerRef.current = setTimeout(() => dismissToast(record.id), remainingRef.current)
  }

  useEffect(() => {
    setPaused(false)
    remainingRef.current = duration
    resumeTimer()
    return () => {
      if (timerRef.current !== undefined) clearTimeout(timerRef.current)
    }
  }, [duration, record.id])

  const handleBlur = (event: FocusEvent<HTMLLIElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) resumeTimer()
  }

  const handlePointerLeave = (event: PointerEvent<HTMLLIElement>) => {
    if (!event.currentTarget.contains(document.activeElement)) resumeTimer()
  }

  return (
    <Toast
      variant={record.variant}
      data-paused={paused}
      data-toast-id={record.id}
      onBlur={handleBlur}
      onFocus={pauseTimer}
      onPointerEnter={pauseTimer}
      onPointerLeave={handlePointerLeave}
    >
      <div className="min-w-0">
        <ToastTitle>{record.title}</ToastTitle>
        {record.description && <ToastDescription>{record.description}</ToastDescription>}
      </div>
      <ToastClose onClick={() => dismissToast(record.id)} />
      {record.action && (
        <ToastAction
          onClick={() => {
            record.action?.onClick?.()
            dismissToast(record.id)
          }}
        >
          {record.action.label}
        </ToastAction>
      )}
      <ToastProgress duration={duration} />
    </Toast>
  )
}

export type ToasterProps = Omit<ComponentPropsWithRef<"ol">, "children"> & {
  duration?: number
  limit?: number
  position?: ToastPosition
}

export function Toaster({
  "aria-label": ariaLabel = "Notifications",
  className,
  duration = 5000,
  limit = 4,
  position = "bottom-right",
  ...props
}: ToasterProps) {
  const records = useSyncExternalStore(subscribeToasts, getToasts, () => emptyServerSnapshot)
  const [mounted, setMounted] = useState(false)
  const visibleLimit = Math.max(1, limit)
  const visibleRecords = records.slice(0, visibleLimit)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return createPortal(
    <ol
      {...props}
      aria-label={ariaLabel}
      data-position={position}
      data-slot="toast-viewport"
      className={cn(toastClassNames.viewport, className)}
    >
      {visibleRecords.map((record) => (
        <ToastItem defaultDuration={duration} key={record.id} record={record} />
      ))}
    </ol>,
    document.body
  )
}
