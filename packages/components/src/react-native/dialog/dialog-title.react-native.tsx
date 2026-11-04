import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
export type DialogTitleProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }
export function DialogTitle({ children, style, theme: override, ...props }: DialogTitleProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      accessibilityRole="header"
      {...props}
      style={[
        {
          color: theme.colors.foreground,
          fontSize: 18,
          lineHeight: 24,
          fontWeight: "600",
          letterSpacing: -0.45,
          fontFamily: theme.fonts?.semibold,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
