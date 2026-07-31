import { dialogOverlayVariants, dialogVariants } from "@/+css/dialog.css"
import { connectDialog, onDialogDismiss, type DialogDismissReason } from "@/lib/dialog"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"
import {
  useEffect,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithRef,
  type CSSProperties,
} from "react"

const $overlayVariant = resolve(dialogOverlayVariants)
const $variant = resolve(dialogVariants)

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
        "fixed inset-0 grid max-h-dvh place-items-center overflow-y-auto overscroll-contain bg-foreground/40 backdrop-blur-[3px] focus:outline-none motion-reduce:backdrop-blur-none dark:bg-background/72 dark:backdrop-blur-[8px] [&[hidden]]:hidden",
        $overlayVariant(variant),
        className
      )}
    >
      <div
        data-slot="dialog"
        data-variant={variant}
        tabIndex={-1}
        style={contentStyle}
        className={cn(
          "group/dialog relative my-auto w-full overflow-hidden bg-surface-raised text-foreground focus:outline-none",
          $variant(variant),
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}
