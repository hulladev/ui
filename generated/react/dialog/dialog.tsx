import { vn, cn } from "@/lib/style"
import { Backdrop } from "../backdrop/backdrop"
import { connectDialog, onDialogDismiss, type DialogDismissReason } from "@/lib/dialog"
import {
  useEffect,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithRef,
  type CSSProperties,
} from "react"

const $overlayVariant = vn({
  compact: "p-4 [&[hidden]>[data-slot=dialog]]:[transform:translateY(4px)_scale(0.98)]",
  workspace: "p-2 sm:p-6 [&[hidden]>[data-slot=dialog]]:[transform:translateY(4px)]",
  fullscreen: "p-0",
})
const $variant = vn({
  compact:
    "starting:[transform:translateY(4px)_scale(0.98)] max-w-lg rounded-lg border border-border p-6 shadow-(--shadow-overlay) has-[>[data-slot=command]]:max-w-2xl has-[>[data-slot=command]]:p-0 [&>[data-slot=command]]:rounded-[inherit] [&>[data-slot=command]]:border-0 [&>[data-slot=command]]:shadow-none dark:border-foreground/15 dark:bg-surface-raised/84 dark:backdrop-blur-2xl",
  workspace:
    "starting:[transform:translateY(4px)] flex h-[calc(100dvh-1rem)] max-w-[90rem] flex-col rounded-lg border border-border shadow-(--shadow-overlay) dark:border-foreground/15 dark:bg-surface-raised/88 dark:backdrop-blur-2xl sm:h-[calc(100dvh-3rem)]",
  fullscreen: "flex h-dvh max-w-none flex-col rounded-none border-0 shadow-none",
})

export type DialogProps = Omit<ComponentPropsWithRef<"div">, "onDismiss"> & {
  contentClassName?: string
  contentStyle?: CSSProperties
  dismissible?: boolean
  onDismiss?: (reason: DialogDismissReason) => void
  variant?: typeof $variant.infer
}

export function Dialog({
  "aria-modal": ariaModal = true,
  children,
  className,
  contentClassName,
  contentStyle,
  dismissible = true,
  hidden = false,
  onDismiss,
  role = "dialog",
  style,
  tabIndex = -1,
  variant = "compact",
  ...props
}: DialogProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(props.ref, () => elementRef.current as HTMLDivElement, [])
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectDialog(element)
    const removeDismissListener = onDialogDismiss(element, (event) => {
      onDismissRef.current?.(event.detail.reason)
    })

    return () => {
      removeDismissListener()
      controller.destroy()
    }
  }, [])

  return (
    <div
      {...props}
      ref={elementRef}
      aria-modal={ariaModal}
      data-dismissible={dismissible}
      data-slot="dialog-overlay"
      data-state={hidden ? "closed" : "open"}
      data-variant={variant}
      hidden={hidden}
      role={role}
      tabIndex={tabIndex}
      style={{
        zIndex: "calc(var(--hulla-layer-base, 1000) + var(--hulla-layer-order, 0))",
        ...style,
      }}
      className={cn(
        "fixed inset-0 grid max-h-dvh place-items-center overflow-y-auto overscroll-contain focus:outline-none transition-[display] duration-160 [transition-behavior:allow-discrete] motion-reduce:transition-none [&[hidden]]:hidden [&[hidden]]:pointer-events-none [&[hidden]>[data-slot=backdrop]]:opacity-0 [&[hidden]>[data-slot=dialog]]:opacity-0",
        $overlayVariant(variant),
        className
      )}
    >
      <Backdrop />
      <div
        data-slot="dialog"
        data-variant={variant}
        tabIndex={-1}
        style={contentStyle}
        className={cn(
          "group/dialog relative my-auto w-full overflow-hidden bg-surface-raised text-foreground focus:outline-none transition-[opacity,transform] duration-160 ease-out starting:opacity-0 motion-reduce:transition-none",
          $variant(variant),
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}
