import type { ComponentPropsWithRef } from "react"
import { Image } from "react-native"

export type AvatarImageProps = ComponentPropsWithRef<typeof Image>

export function AvatarImage({ style, ...props }: AvatarImageProps) {
  return <Image resizeMode="cover" {...props} style={[{ width: "100%", height: "100%" }, style]} />
}
