import { useState, type ComponentPropsWithRef } from "react"
import { Platform, TextInput } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
import { textInputStyle } from "@/lib/text-input-style.react-native"

export type TextareaProps = Omit<ComponentPropsWithRef<typeof TextInput>, "multiline"> & {
  theme?: NativeTheme
  invalid?: boolean
}

export function Textarea({
  children,
  style,
  theme: override,
  editable = true,
  invalid = false,
  accessibilityState,
  placeholderTextColor,
  selectionColor,
  onFocus,
  onBlur,
  ...props
}: TextareaProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const inactive =
    !editable || Boolean(props.readOnly || accessibilityState?.disabled || props["aria-disabled"])
  return (
    <TextInput
      {...props}
      {...(Platform.OS === "web" ? { "aria-invalid": invalid || undefined } : {})}
      multiline
      editable={!inactive}
      accessibilityState={{ ...accessibilityState, disabled: inactive }}
      placeholderTextColor={
        placeholderTextColor ??
        (inactive ? theme.colors.disabledForeground : theme.colors.mutedForeground)
      }
      selectionColor={selectionColor ?? theme.colors.primary}
      underlineColorAndroid={props.underlineColorAndroid ?? "transparent"}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      style={[
        textInputStyle(theme, focused, inactive, invalid),
        { minHeight: 112, textAlignVertical: "top" },
        style,
      ]}
    >
      {children}
    </TextInput>
  )
}
