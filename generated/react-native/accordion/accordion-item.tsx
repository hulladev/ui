import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
export type AccordionItemProps = ComponentPropsWithRef<typeof View> & { theme?: NativeTheme }
export function AccordionItem({ children, style, theme: override, ...props }: AccordionItemProps) {
  const theme = useNativeTheme(override)
  return (
    <View {...props} style={[{ borderBottomWidth: 1, borderColor: theme.colors.border }, style]}>
      {children}
    </View>
  )
}
