import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
export type FileUploadItemProps = ComponentPropsWithRef<typeof View>
export function FileUploadItem({ children, style, ...props }: FileUploadItemProps) {
  return (
    <View {...props} style={[{ flexDirection: "row", alignItems: "center", gap: 12 }, style]}>
      {children}
    </View>
  )
}
