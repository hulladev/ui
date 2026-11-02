import type { ComponentPropsWithRef } from "react"
import { View } from "react-native"
export type FileUploadProps = ComponentPropsWithRef<typeof View>
export function FileUpload({ children, style, ...props }: FileUploadProps) {
  return (
    <View {...props} style={[{ gap: 12 }, style]}>
      {children}
    </View>
  )
}
