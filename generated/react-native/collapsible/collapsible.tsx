import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
export type CollapsibleProps = ComponentPropsWithRef<typeof View> & { theme?: NativeTheme }
export function Collapsible({ children, style, theme: override, ...props }: CollapsibleProps) {
  const theme = useNativeTheme(override)
  return (
    <View {...props} style={[{ minWidth: 0, borderColor: theme.colors.border }, style]}>
      {children}
    </View>
  )
}
