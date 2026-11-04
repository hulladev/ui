import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
export type DialogDescriptionProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }
export function DialogDescription({
  children,
  style,
  theme: override,
  ...props
}: DialogDescriptionProps) {
  const theme = useNativeTheme(override)
  return (
    <Text
      {...props}
      style={[
        {
          color: theme.colors.mutedForeground,
          fontSize: 14,
          lineHeight: 24,
          fontWeight: "400",
          fontFamily: theme.fonts?.regular,
        },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
