import type { ComponentPropsWithRef } from "react"

export type TableBodyProps = ComponentPropsWithRef<"tbody">

export function TableBody({ children, className, ...props }: TableBodyProps) {
  return (
    <tbody {...props} data-slot="table-body" className={className}>
      {children}
    </tbody>
  )
}
