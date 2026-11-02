import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { nativeColorAlpha } from "@/lib/native-color"

export type TreeGroupProps = ComponentPropsWithRef<typeof View> & { theme?: NativeTheme }
export function TreeGroup({ children, style, theme: override, ...props }: TreeGroupProps) {
  const theme = useNativeTheme(override)
  return (
    <View
      {...props}
      style={[
        {
          marginTop: 2,
          marginLeft: 15,
          paddingLeft: 8,
          gap: 2,
          borderLeftWidth: 1,
          borderLeftColor: nativeColorAlpha(theme.colors.border, 0.7),
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
