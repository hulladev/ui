import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"

export type ListItemDescriptionProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
  disabled?: boolean
}

export function ListItemDescription({
  children,
  disabled = false,
  style,
  theme: override,
  ...props
}: ListItemDescriptionProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          color: disabled ? theme.colors.disabledForeground : theme.colors.mutedForeground,
          fontSize: 12,
          lineHeight: 20,
          fontFamily: theme.fonts?.regular,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
