import { useState, type ComponentPropsWithRef } from "react"
import { TextInput } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { textInputStyle } from "@/lib/text-input-style"
export type ComboboxProps = ComponentPropsWithRef<typeof TextInput> & { theme?: NativeTheme }
export function Combobox({
  children,
  style,
  theme: override,
  editable = true,
  onFocus,
  onBlur,
  placeholderTextColor,
  selectionColor,
  accessibilityState,
  ...props
}: ComboboxProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const inactive =
    !editable || Boolean(props.readOnly || accessibilityState?.disabled || props["aria-disabled"])
  return (
    <TextInput
      autoCorrect={false}
      returnKeyType="search"
      {...props}
      editable={!inactive}
      accessibilityState={{ ...accessibilityState, disabled: inactive }}
      placeholderTextColor={placeholderTextColor ?? theme.colors.mutedForeground}
      selectionColor={selectionColor ?? theme.colors.primary}
      underlineColorAndroid={props.underlineColorAndroid ?? "transparent"}
      onFocus={(e) => {
        setFocused(true)
        onFocus?.(e)
      }}
      onBlur={(e) => {
        setFocused(false)
        onBlur?.(e)
      }}
      style={[textInputStyle(theme, focused, inactive, false), style]}
    >
      {children}
    </TextInput>
  )
}
