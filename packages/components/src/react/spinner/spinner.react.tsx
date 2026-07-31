import { cn } from "@/lib/style"
import type { ComponentPropsWithRef } from "react"

export type SpinnerProps = ComponentPropsWithRef<"svg">

export function Spinner({
  "aria-hidden": ariaHidden = true,
  children,
  className,
  focusable = "false",
  ...props
}: SpinnerProps) {
  return (
    <svg
      {...props}
      aria-hidden={ariaHidden}
      focusable={focusable}
      viewBox="0 0 24 24"
      fill="none"
      data-slot="spinner"
      className={cn(
        "inline-block size-4 shrink-0 animate-spin align-[-0.125em] motion-reduce:animate-none",
        className
      )}
    >
      {children}
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.25" opacity="0.2" />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  )
}
