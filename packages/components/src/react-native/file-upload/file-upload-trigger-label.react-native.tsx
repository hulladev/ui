import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"

export type FileUploadTriggerLabelProps = ComponentPropsWithRef<typeof Text> & {
  theme?: NativeTheme
  disabled?: boolean
}

export function FileUploadTriggerLabel({
  children,
  style,
  disabled = false,
  theme: override,
  ...props
}: FileUploadTriggerLabelProps) {
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
