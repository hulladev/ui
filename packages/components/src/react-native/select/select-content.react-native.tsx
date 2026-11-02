import type { DrawerProps } from "../drawer/drawer.react-native"
import { Drawer } from "../drawer/drawer.react-native"
export type SelectContentProps = DrawerProps
export function SelectContent({
  children,
  contentStyle,
  contentContainerStyle,
  ...props
}: SelectContentProps) {
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
