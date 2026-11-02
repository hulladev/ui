import type { DrawerProps } from "../drawer/drawer"
import { Drawer } from "../drawer/drawer"
export type DropdownMenuProps = DrawerProps
export function DropdownMenu({
  children,
  contentStyle,
  contentContainerStyle,
  ...props
}: DropdownMenuProps) {
  return (
    <Drawer
      {...props}
      contentStyle={[{}, contentStyle]}
      contentContainerStyle={[{ padding: 0, paddingBottom: 32, gap: 0 }, contentContainerStyle]}
    >
      {children}
    </Drawer>
  )
}
