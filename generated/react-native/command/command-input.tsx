import { useState, type ComponentPropsWithRef } from "react"
import { TextInput, View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
export type CommandInputProps = ComponentPropsWithRef<typeof TextInput> & {
  theme?: NativeTheme
  containerStyle?: ComponentPropsWithRef<typeof View>["style"]
}
export function CommandInput({
  children,
  style,
  containerStyle,
  theme: override,
  editable = true,
  onFocus,
  onBlur,
  placeholderTextColor,
  selectionColor,
  accessibilityState,
  ...props
}: CommandInputProps) {
  const theme = useNativeTheme(override)
  const [focused, setFocused] = useState(false)
  const inactive =
    !editable || Boolean(props.readOnly || accessibilityState?.disabled || props["aria-disabled"])
  return (
    <View
      style={[
        {
          minHeight: 48,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 14,
          borderBottomWidth: 1,
          borderBottomColor: focused && !inactive ? theme.colors.focusRing : theme.colors.border,
        },
        containerStyle,
      ]}
    >
      <View
        accessible={false}
        pointerEvents="none"
        style={{ width: 16, height: 16, alignItems: "center", justifyContent: "center" }}
      >
        <View
          style={{
            position: "absolute",
            left: 1,
            top: 1,
            width: 10,
            height: 10,
            borderRadius: 5,
            borderWidth: 1.5,
            borderColor: theme.colors.mutedForeground,
          }}
        />
        <View
          style={{
            position: "absolute",
            left: 10,
            top: 10,
            width: 5,
            height: 1.5,
            backgroundColor: theme.colors.mutedForeground,
            transform: [{ rotate: "45deg" }],
          }}
        />
      </View>
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
        style={[
          {
            minHeight: 47,
            flex: 1,
            minWidth: 0,
            paddingHorizontal: 0,
            paddingVertical: 13.5,
            borderWidth: 0,
            borderBottomWidth: 0,
            borderRadius: 0,
            backgroundColor: "transparent",
            fontSize: 14,
            lineHeight: 20,
            fontFamily: theme.fonts?.regular,
            color: inactive ? theme.colors.disabledForeground : theme.colors.foreground,
            outlineWidth: 0,
          },
          style,
        ]}
      >
        {children}
      </TextInput>
    </View>
  )
}
