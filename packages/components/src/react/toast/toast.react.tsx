import { toastClassNames, toastVariantClassNames, type ToastVariant } from "@/lib/toast"
import { cn } from "@/lib/style"
import type { ComponentPropsWithRef, CSSProperties } from "react"
import { Button } from "../button/button.react"
import { Progress, type ProgressProps } from "../progress/progress.react"

export type ToastProps = ComponentPropsWithRef<"li"> & {
  variant?: ToastVariant
}

export function Toast({ children, className, role, variant = "note", ...props }: ToastProps) {
  return (
    <li
      {...props}
      aria-atomic="true"
      role={role ?? (variant === "danger" ? "alert" : "status")}
      data-slot="toast"
      data-variant={variant}
      className={cn(toastClassNames.toast, toastVariantClassNames[variant], className)}
    >
      {children}
    </li>
  )
}

export type ToastTitleProps = ComponentPropsWithRef<"strong">

export function ToastTitle({ className, ...props }: ToastTitleProps) {
  return (
    <strong {...props} data-slot="toast-title" className={cn(toastClassNames.title, className)} />
  )
}

export type ToastDescriptionProps = ComponentPropsWithRef<"p">

export function ToastDescription({ className, ...props }: ToastDescriptionProps) {
  return (
    <p
      {...props}
      data-slot="toast-description"
      className={cn(toastClassNames.description, className)}
    />
  )
}

export type ToastProgressProps = ProgressProps & {
  duration?: number
}

export function ToastProgress({
  className,
  duration = 5000,
  max = 100,
  style,
  value = 100,
  ...props
}: ToastProgressProps) {
  if (duration <= 0) return null

  return (
    <Progress
      {...props}
      aria-hidden="true"
      data-slot="toast-progress"
      max={max}
      value={value}
      className={cn(toastClassNames.progress, className)}
      style={
        {
          ...style,
          "--hulla-toast-duration": `${duration}ms`,
        } as CSSProperties
      }
    />
  )
}

export type ToastActionProps = ComponentPropsWithRef<typeof Button>

export function ToastAction({
  className,
  size = "sm",
  variant = "outline",
  ...props
}: ToastActionProps) {
  return (
    <Button
      {...props}
      data-slot="toast-action"
      size={size}
      variant={variant}
      className={cn(toastClassNames.action, className)}
    />
  )
}

export type ToastCloseProps = ComponentPropsWithRef<"button">

export function ToastClose({
  "aria-label": ariaLabel = "Dismiss notification",
  children,
  className,
  type = "button",
  ...props
}: ToastCloseProps) {
  return (
    <button
      {...props}
      aria-label={ariaLabel}
      data-slot="toast-close"
      type={type}
      className={cn(toastClassNames.close, className)}
    >
      {children ?? (
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none">
          <path d="m4 4 8 8m0-8-8 8" stroke="currentColor" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}
