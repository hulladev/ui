import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
export type SelectItemTextProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
  selected?: boolean
  disabled?: boolean
}
export function SelectItemText({
  children,
  style,
  theme: override,
  selected = false,
  disabled = false,
  ...props
}: SelectItemTextProps) {
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
            : selected
              ? theme.colors.primaryText
              : theme.colors.foreground,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
