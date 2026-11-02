import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
export type DropdownMenuItemTextProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
  destructive?: boolean
  disabled?: boolean
}
export function DropdownMenuItemText({
  children,
  style,
  theme: override,
  destructive = false,
  disabled = false,
  ...props
}: DropdownMenuItemTextProps) {
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
