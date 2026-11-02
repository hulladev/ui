import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
export type TabsContentProps = ComponentPropsWithRef<typeof View> & { selected: boolean }
export function TabsContent({ children, style, selected, ...props }: TabsContentProps) {
  return (
    <View
      role="tabpanel"
      {...props}
      accessibilityElementsHidden={!selected}
      importantForAccessibility={selected ? "auto" : "no-hide-descendants"}
      aria-hidden={!selected}
      style={[
        { minWidth: 0, borderRadius: 7, gap: 12 },
        style,
        !selected ? { display: "none" } : undefined,
      ]}
    >
      {children}
    </View>
  )
}
