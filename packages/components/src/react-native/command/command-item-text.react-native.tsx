import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
export type CommandItemTextProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
  disabled?: boolean
  destructive?: boolean
}
export function CommandItemText({
  children,
  style,
  theme: override,
  disabled = false,
  destructive = false,
  ...props
}: CommandItemTextProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          flexShrink: 1,
          fontSize: 13,
          lineHeight: 20,
          fontWeight: "400",
          fontFamily: theme.fonts?.regular,
          color: disabled
            ? theme.colors.disabledForeground
            : destructive
              ? theme.colors.danger
              : theme.colors.foreground,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
