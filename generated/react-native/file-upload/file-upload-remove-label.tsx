import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"

export type FileUploadRemoveLabelProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
  disabled?: boolean
}

export function FileUploadRemoveLabel({
  children,
  style,
  disabled = false,
  theme: override,
  ...props
}: FileUploadRemoveLabelProps) {
  const theme = useNativeTheme(override)

  return (
    <Text
      {...props}
      style={[
        {
          color: disabled ? theme.colors.disabledForeground : theme.colors.foreground,
          fontSize: 14,
          lineHeight: 20,
          fontWeight: "500",
          fontFamily: theme.fonts?.medium,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
