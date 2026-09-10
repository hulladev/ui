import { createMutableRef, exposeRef, onMountEffect } from "@/lib/solid"
import { mergeProps, splitProps, type JSX } from "solid-js"
import { Backdrop } from "../backdrop/backdrop.solid"
import { dialogOverlayVariants, dialogVariants } from "@/+css/dialog.css"
import { connectDialog, onDialogDismiss, type DialogDismissReason } from "@/lib/dialog"
import { cn } from "@/lib/style"
import { resolve } from "@hulla/ui"

const $overlayVariant = resolve(dialogOverlayVariants)
const $variant = resolve(dialogVariants)

export type DialogProps = Omit<JSX.IntrinsicElements["div"], "onDismiss"> & {
  contentClassName?: string
  contentStyle?: JSX.CSSProperties
  dismissible?: boolean
  onDismiss?: (reason: DialogDismissReason) => void
  variant?: typeof $variant.infer
}

export function Dialog(props: DialogProps) {
  const [local, rest] = splitProps(
    mergeProps(
      {
        "aria-modal": true,
        dismissible: true,
        hidden: false,
        role: "dialog",
        tabIndex: -1,
        variant: "compact",
      } as const,
      props
    ),
    [
      "aria-modal",
      "children",
      "class",
      "contentClassName",
      "contentStyle",
      "dismissible",
      "hidden",
      "onDismiss",
      "role",
      "style",
      "tabIndex",
      "variant",
    ]
  )

  const elementRef = createMutableRef<HTMLDivElement>(null)
  exposeRef(rest.ref, () => elementRef.current as HTMLDivElement, [])
  onMountEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = connectDialog(element)
    const removeDismissListener = onDialogDismiss(element, (event) => {
      local.onDismiss?.(event.detail.reason)
    })

    return () => {
      removeDismissListener()
      controller.destroy()
    }
  })

  return (
    <div
      {...rest}
      ref={elementRef}
      aria-modal={local["aria-modal"]}
      data-dismissible={local.dismissible}
      data-slot="dialog-overlay"
      data-state={local.hidden ? "closed" : "open"}
      data-variant={local.variant}
      hidden={local.hidden}
      role={local.role}
      tabindex={local.tabIndex}
      style={
        typeof local.style === "string"
          ? `${local.style};z-index:calc(var(--hulla-layer-base, 1000) + var(--hulla-layer-order, 0))`
          : {
              "z-index": "calc(var(--hulla-layer-base, 1000) + var(--hulla-layer-order, 0))",
              ...local.style,
            }
      }
      class={cn(
        "fixed inset-0 grid max-h-dvh place-items-center overflow-y-auto overscroll-contain focus:outline-none transition-[display] duration-160 [transition-behavior:allow-discrete] motion-reduce:transition-none [&[hidden]]:hidden [&[hidden]]:pointer-events-none [&[hidden]>[data-slot=backdrop]]:opacity-0 [&[hidden]>[data-slot=dialog]]:opacity-0",
        $overlayVariant(local.variant),
        local.class
      )}
    >
      <Backdrop />
      <div
        data-slot="dialog"
        data-variant={local.variant}
        tabindex={-1}
        style={local.contentStyle}
        class={cn(
          "group/dialog relative my-auto w-full overflow-hidden bg-surface-raised text-foreground focus:outline-none transition-[opacity,transform] duration-160 ease-out starting:opacity-0 motion-reduce:transition-none",
          $variant(local.variant),
          local.contentClassName
        )}
      >
        {local.children}
      </div>
    </div>
  )
}
