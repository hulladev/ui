import type { ComponentPropsWithRef } from "react"
import { KeyboardAvoidingView, Platform } from "react-native"

export type KeyboardAwareProps = ComponentPropsWithRef<typeof KeyboardAvoidingView>

export function KeyboardAware({
  children,
  style,
  behavior = Platform.OS === "ios" ? "padding" : undefined,
  ...props
}: KeyboardAwareProps) {
  return (
    <KeyboardAvoidingView {...props} behavior={behavior} style={style}>
      {children}
    </KeyboardAvoidingView>
  )
}
