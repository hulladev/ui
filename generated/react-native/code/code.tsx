import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { nativeColorAlpha } from "@/lib/native-color"

export type CodeProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }

export function Code({ children, style, theme: override, ...props }: CodeProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      selectable
      {...props}
      style={[
        {
          alignSelf: "flex-start",
          maxWidth: "100%",
          flexShrink: 1,
          color: theme.colors.foreground,
          backgroundColor: nativeColorAlpha(theme.colors.foreground, 0.05),
          fontSize: 12.25,
          lineHeight: 20,
          fontFamily: theme.fonts?.mono,
          paddingHorizontal: 3.0625,
          paddingVertical: 1.53125,
          borderRadius: 3.0625,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
