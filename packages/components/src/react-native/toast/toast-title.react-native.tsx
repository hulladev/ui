import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
export type ToastTitleProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }
export function ToastTitle({ children, style, theme: override, ...props }: ToastTitleProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          fontSize: 14,
          lineHeight: 20,
          fontWeight: "600",
          fontFamily: theme.fonts?.semibold,
          color: theme.colors.foreground,
          letterSpacing: -0.175,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
