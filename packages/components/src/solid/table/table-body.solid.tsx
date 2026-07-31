import { splitProps, type JSX } from "solid-js"

export type TableBodyProps = JSX.IntrinsicElements["tbody"]

export function TableBody(props: TableBodyProps) {
  const [local, rest] = splitProps(props, ["children", "class"])

  return (
    <tbody {...rest} data-slot="table-body" class={local.class}>
      {local.children}
    </tbody>
  )
}
