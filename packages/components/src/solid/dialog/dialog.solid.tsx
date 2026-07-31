import { createMutableRef, exposeRef, onMountEffect } from "@/lib/solid"
import { mergeProps, splitProps, type JSX } from "solid-js"
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
        "fixed inset-0 grid max-h-dvh place-items-center overflow-y-auto overscroll-contain bg-foreground/40 backdrop-blur-[3px] focus:outline-none motion-reduce:backdrop-blur-none dark:bg-background/72 dark:backdrop-blur-[8px] [&[hidden]]:hidden",
        $overlayVariant(local.variant),
        local.class
      )}
    >
      <div
        data-slot="dialog"
        data-variant={local.variant}
        tabindex={-1}
        style={local.contentStyle}
        class={cn(
          "group/dialog relative my-auto w-full overflow-hidden bg-surface-raised text-foreground focus:outline-none",
          $variant(local.variant),
          local.contentClassName
        )}
      >
        {local.children}
      </div>
    </div>
  )
}
