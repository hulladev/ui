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

const $overlaySide = vn({
  right: "justify-items-end [&[hidden]>[data-slot=drawer]]:[transform:translateX(100%)]",
  left: "justify-items-start [&[hidden]>[data-slot=drawer]]:[transform:translateX(-100%)]",
  top: "items-start [&[hidden]>[data-slot=drawer]]:[transform:translateY(-100%)]",
  bottom: "items-end [&[hidden]>[data-slot=drawer]]:[transform:translateY(100%)]",
})
const $side = vn({
  right:
    "h-dvh w-[min(24rem,calc(100vw-2rem))] border-l border-border starting:[transform:translateX(100%)]",
  left: "h-dvh w-[min(24rem,calc(100vw-2rem))] border-r border-border starting:[transform:translateX(-100%)]",
  top: "max-h-[calc(100dvh-2rem)] w-full border-b border-border starting:[transform:translateY(-100%)]",
  bottom:
    "max-h-[calc(100dvh-2rem)] w-full border-t border-border starting:[transform:translateY(100%)]",
})

export type DrawerProps = Omit<ComponentPropsWithRef<"div">, "onDismiss"> & {
  contentClassName?: string
  contentStyle?: CSSProperties
  dismissible?: boolean
  onDismiss?: (reason: DialogDismissReason) => void
  side?: typeof $side.infer
}

export function Drawer({
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
  side = "right",
  ...props
}: DrawerProps) {
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
      data-slot="drawer-overlay"
      data-state={hidden ? "closed" : "open"}
      data-side={side}
      hidden={hidden}
      role={role}
      tabIndex={tabIndex}
      style={{
        zIndex: "calc(var(--hulla-layer-base, 1000) + var(--hulla-layer-order, 0))",
        ...style,
      }}
      className={cn(
        "fixed inset-0 grid max-h-dvh overflow-hidden overscroll-contain focus:outline-none transition-[display] duration-160 [transition-behavior:allow-discrete] motion-reduce:transition-none [&[hidden]]:hidden [&[hidden]]:pointer-events-none [&[hidden]>[data-slot=backdrop]]:opacity-0",
        $overlaySide(side),
        className
      )}
    >
      <Backdrop />
      <div
        data-slot="drawer"
        data-side={side}
        tabIndex={-1}
        style={contentStyle}
        className={cn(
          "group/drawer relative flex min-h-0 flex-col gap-6 overflow-y-auto overscroll-contain bg-surface-raised p-6 text-foreground shadow-(--shadow-overlay) focus:outline-none transition-transform duration-160 ease-out motion-reduce:transition-none",
          $side(side),
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}
