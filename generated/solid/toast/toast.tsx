import { mergeProps, splitProps, type ComponentProps, type JSX } from "solid-js"
import { toastClassNames, toastVariantClassNames, type ToastVariant } from "@/lib/toast"
import { cn } from "@/lib/style"
import { Button } from "../button/button"
import { Progress, type ProgressProps } from "../progress/progress"

export type ToastProps = JSX.IntrinsicElements["li"] & {
  variant?: ToastVariant
}

export function Toast(props: ToastProps) {
  const [local, rest] = splitProps(mergeProps({ variant: "note" } as const, props), [
    "children",
    "class",
    "role",
    "variant",
  ])

  return (
    <li
      {...rest}
      aria-atomic="true"
      role={local.role ?? (local.variant === "danger" ? "alert" : "status")}
      data-slot="toast"
      data-variant={local.variant}
      class={cn(toastClassNames.toast, toastVariantClassNames[local.variant], local.class)}
    >
      {local.children}
    </li>
  )
}

export type ToastTitleProps = JSX.IntrinsicElements["strong"]

export function ToastTitle(props: ToastTitleProps) {
  const [local, rest] = splitProps(props, ["class"])

  return <strong {...rest} data-slot="toast-title" class={cn(toastClassNames.title, local.class)} />
}

export type ToastDescriptionProps = JSX.IntrinsicElements["p"]

export function ToastDescription(props: ToastDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"])

  return (
    <p
      {...rest}
      data-slot="toast-description"
      class={cn(toastClassNames.description, local.class)}
    />
  )
}

export type ToastProgressProps = ProgressProps & {
  duration?: number
}

export function ToastProgress(props: ToastProgressProps) {
  const [local, rest] = splitProps(
    mergeProps({ duration: 5000, max: 100, value: 100 } as const, props),
    ["class", "duration", "max", "style", "value"]
  )

  if (local.duration <= 0) return null

  return (
    <Progress
      {...rest}
      aria-hidden="true"
      data-slot="toast-progress"
      max={local.max}
      value={local.value}
      class={cn(toastClassNames.progress, local.class)}
      style={
        typeof local.style === "string"
          ? `${local.style};--hulla-toast-duration:${local.duration}ms`
          : ({
              ...local.style,
              "--hulla-toast-duration": `${local.duration}ms`,
            } as JSX.CSSProperties)
      }
    />
  )
}

export type ToastActionProps = ComponentProps<typeof Button>

export function ToastAction(props: ToastActionProps) {
  const [local, rest] = splitProps(mergeProps({ size: "sm", variant: "outline" } as const, props), [
    "class",
    "size",
    "variant",
  ])

  return (
    <Button
      {...rest}
      data-slot="toast-action"
      size={local.size}
      variant={local.variant}
      class={cn(toastClassNames.action, local.class)}
    />
  )
}

export type ToastCloseProps = JSX.IntrinsicElements["button"]

export function ToastClose(props: ToastCloseProps) {
  const [local, rest] = splitProps(
    mergeProps({ "aria-label": "Dismiss notification", type: "button" } as const, props),
    ["aria-label", "children", "class", "type"]
  )

  return (
    <button
      {...rest}
      aria-label={local["aria-label"]}
      data-slot="toast-close"
      type={local.type}
      class={cn(toastClassNames.close, local.class)}
    >
      {local.children ?? (
        <svg aria-hidden="true" viewBox="0 0 16 16" class="size-3.5" fill="none">
          <path d="m4 4 8 8m0-8-8 8" stroke="currentColor" stroke-linecap="round" />
        </svg>
      )}
    </button>
  )
}
