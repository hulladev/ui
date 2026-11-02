import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
export type TreeViewProps = ComponentPropsWithRef<typeof View>
export function TreeView({ children, style, ...props }: TreeViewProps) {
  return (
    <View {...props} style={[{ gap: 2 }, style]}>
      {children}
    </View>
  )
}
