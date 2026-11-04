import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
export type PopoverTitleProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }
export function PopoverTitle({ children, style, theme: override, ...props }: PopoverTitleProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      accessibilityRole="header"
      {...props}
      style={[
        {
          fontSize: 14,
          lineHeight: 20,
          fontWeight: "600",
          fontFamily: theme.fonts?.semibold,
          color: theme.colors.foreground,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
