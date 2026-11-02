import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"

export type ListItemContentProps = ComponentPropsWithRef<typeof View>

export function ListItemContent({ children, style, ...props }: ListItemContentProps) {
  return (
    <View {...props} style={[{ flex: 1, minWidth: 0, gap: 2 }, style]}>
      {children}
    </View>
  )
}
