import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
export type ToastDescriptionProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }
export function ToastDescription({
  children,
  style,
  theme: override,
  ...props
}: ToastDescriptionProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          fontSize: 13,
          lineHeight: 20,
          fontWeight: "400",
          fontFamily: theme.fonts?.regular,
          color: theme.colors.mutedForeground,
          marginTop: 4,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
