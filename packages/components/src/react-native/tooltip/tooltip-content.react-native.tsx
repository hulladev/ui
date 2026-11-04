import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
import { alpha } from "@hulla/style-native/color"
export type TooltipContentProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }
export function TooltipContent({
  children,
  style,
  theme: override,
  ...props
}: TooltipContentProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          fontSize: 12,
          lineHeight: 20,
          fontWeight: "500",
          fontFamily: theme.fonts?.medium,
          color: theme.colors.background,
          backgroundColor: theme.colors.foreground,
          borderColor: alpha(theme.colors.foreground, 0.1),
          borderWidth: 1,
          borderRadius: theme.radius.sm,
          paddingHorizontal: 8,
          paddingVertical: 4,
          maxWidth: 288,
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
