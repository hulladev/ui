import { cn } from "@/lib/style"
import type { ComponentPropsWithoutRef } from "react"

export type BreadcrumbItemProps = ComponentPropsWithoutRef<"li">

export function BreadcrumbItem({ children, className, ...props }: BreadcrumbItemProps) {
  return (
    <li
      {...props}
      data-slot="breadcrumb-item"
      className={cn(
        "inline-flex min-w-0 items-center gap-2 aria-[current=page]:font-medium aria-[current=page]:text-foreground [&:not(:first-child)]:before:size-1.5 [&:not(:first-child)]:before:shrink-0 [&:not(:first-child)]:before:rotate-[-45deg] [&:not(:first-child)]:before:border-r [&:not(:first-child)]:before:border-b [&:not(:first-child)]:before:border-current [&:not(:first-child)]:before:content-[''] [&>a]:-mx-1.5 [&>a]:inline-flex [&>a]:min-w-0 [&>a]:rounded-sm [&>a]:px-1.5 [&>a]:py-1 [&>a]:text-muted-foreground [&>a]:underline-offset-4 [&>a]:transition-colors [&>a]:duration-150 [&>a]:hover:text-foreground [&>a]:hover:underline motion-reduce:[&>a]:transition-none",
        className
      )}
    >
      {children}
    </li>
  )
}
