import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"

export type CardFooterProps = ComponentPropsWithRef<typeof View> & { theme?: NativeTheme }

export function CardFooter({ children, style, theme: override, ...props }: CardFooterProps) {
  const theme = useNativeTheme(override)
  return (
    <View
      {...props}
      style={[
        {
          marginTop: "auto",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 12,
          borderTopWidth: 1,
          borderColor: theme.colors.border,
          paddingTop: 20,
        },
        style,
      ]}
    >
      {children}
    </View>
  )
}
