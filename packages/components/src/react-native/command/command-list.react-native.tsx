import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
export type CommandListProps = ComponentPropsWithRef<typeof View>
export function CommandList({ children, style, ...props }: CommandListProps) {
  return (
    <View {...props} style={[{ padding: 6 }, style]}>
      {children}
    </View>
  )
}
