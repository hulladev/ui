import { vn, cn } from "@/lib/style"
import { createMutableRef, exposeRef, onMountEffect } from "@/lib/solid"
import { mergeProps, splitProps, type JSX } from "solid-js"
import { connectDialog, onDialogDismiss, type DialogDismissReason } from "@/lib/dialog"

const $overlayVariant = vn({
  compact: "p-4",
  workspace: "p-2 sm:p-6",
  fullscreen: "p-0",
})
const $variant = vn({
  compact:
    "max-w-lg rounded-lg border border-border p-6 shadow-[0_1.5rem_5rem_-1.75rem_oklch(0_0_0/0.28)] dark:border-foreground/15 dark:bg-surface-raised/84 dark:shadow-[0_1.75rem_7rem_-2rem_oklch(0_0_0/0.9),inset_0_1px_0_oklch(1_0_0/0.08)] dark:backdrop-blur-2xl",
  workspace:
    "flex h-[calc(100dvh-1rem)] max-w-[90rem] flex-col rounded-lg border border-border shadow-[0_1.5rem_5rem_-1.75rem_oklch(0_0_0/0.28)] dark:border-foreground/15 dark:bg-surface-raised/88 dark:shadow-[0_1.75rem_7rem_-2rem_oklch(0_0_0/0.9),inset_0_1px_0_oklch(1_0_0/0.08)] dark:backdrop-blur-2xl sm:h-[calc(100dvh-3rem)]",
  fullscreen: "flex h-dvh max-w-none flex-col rounded-none border-0 shadow-none",
})

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
