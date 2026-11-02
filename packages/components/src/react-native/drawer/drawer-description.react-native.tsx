import type { ComponentPropsWithRef } from "react"
import { Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
export type DrawerDescriptionProps = ComponentPropsWithRef<typeof Text> & { theme?: NativeTheme }
export function DrawerDescription({
  children,
  style,
  theme: override,
  ...props
}: DrawerDescriptionProps) {
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
