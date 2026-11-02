import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { nativeColorAlpha } from "@/lib/native-color"

export type TableHeaderProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }

export function TableHeader({ children, style, theme: override, ...props }: TableHeaderProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          width: 140,
          flexShrink: 0,
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: nativeColorAlpha(theme.colors.foreground, 0.045),
          color: theme.colors.foreground,
          fontSize: 13,
          lineHeight: 20,
          fontWeight: "600",
          fontFamily: theme.fonts?.semibold,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
