import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
export type AccordionContentProps = ComponentPropsWithRef<typeof View> & { open: boolean }
export function AccordionContent({ children, style, open, ...props }: AccordionContentProps) {
  if (!open) return null
  return (
    <View {...props} style={[{ minWidth: 0, paddingBottom: 20, paddingRight: 40, gap: 12 }, style]}>
      {children}
    </View>
  )
}
