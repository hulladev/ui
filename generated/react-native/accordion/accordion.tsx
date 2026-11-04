import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
export type AccordionProps = ComponentPropsWithRef<typeof View> & { theme?: NativeTheme }
export function Accordion({ children, style, theme: override, ...props }: AccordionProps) {
  const theme = useNativeTheme(override)
  return (
    <View {...props} style={[{ borderTopWidth: 1, borderColor: theme.colors.border }, style]}>
      {children}
    </View>
  )
}
