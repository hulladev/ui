import type { ComponentPropsWithoutRef } from "react"

export type TableBodyProps = ComponentPropsWithoutRef<"tbody">

export function TableBody({ children, className, ...props }: TableBodyProps) {
  return (
    <tbody {...props} data-slot="table-body" className={className}>
      {children}
    </tbody>
  )
}
