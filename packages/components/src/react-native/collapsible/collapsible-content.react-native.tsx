import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
export type CollapsibleContentProps = ComponentPropsWithRef<typeof View> & { open: boolean }
export function CollapsibleContent({ children, style, open, ...props }: CollapsibleContentProps) {
  if (!open) return null
  return (
    <View {...props} style={[{ minWidth: 0 }, style]}>
      {children}
    </View>
  )
}
