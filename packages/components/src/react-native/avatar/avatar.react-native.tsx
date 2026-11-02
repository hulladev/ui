import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { nativeColorAlpha } from "@/lib/native-color"

export type AvatarProps = ComponentPropsWithRef<typeof View> & { theme?: NativeTheme }

export function Avatar({ children, style, theme: override, ...props }: AvatarProps) {
  const theme = useNativeTheme(override)
  return (
    <View
      {...props}
      style={[
        {
          width: 32,
          height: 32,
          flexShrink: 0,
          overflow: "hidden",
          borderRadius: 999,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: nativeColorAlpha(theme.colors.foreground, 0.05),
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
