import {
  useImperativeHandle,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ComponentRef,
} from "react"
import { View, TextInput, Pressable, Text } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme"
import { alpha } from "@hulla/style-native/color"

export type TagInputProps = ComponentPropsWithRef<typeof View> & {
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  inputProps?: Omit<ComponentPropsWithRef<typeof TextInput>, "value" | "defaultValue" | "multiline">
  disabled?: boolean
  theme?: NativeTheme
}
export function TagInput({
  children,
  style,
  value,
  defaultValue = [],
  onValueChange,
  inputProps,
  disabled = false,
  theme: override,
  ...props
}: TagInputProps) {
  const theme = useNativeTheme(override)
  const [local, setLocal] = useState(defaultValue)
  const [draft, setDraft] = useState("")
  const [focused, setFocused] = useState(false)
  const [focusedTag, setFocusedTag] = useState<number | null>(null)
  const [addFocused, setAddFocused] = useState(false)
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null)
  useImperativeHandle(inputProps?.ref, () => inputRef.current as ComponentRef<typeof TextInput>, [])
  const inputInactive = Boolean(
    disabled ||
    inputProps?.editable === false ||
    inputProps?.readOnly ||
    inputProps?.accessibilityState?.disabled ||
    inputProps?.["aria-disabled"]
  )
  const focusWithin = focused || focusedTag !== null || addFocused
  const tags = value ?? local
  const publish = (next: string[]) => {
    if (value === undefined) setLocal(next)
    onValueChange?.(next)
  }
  const add = () => {
    const tag = draft.trim()
    if (disabled || !tag) return
    if (!tags.includes(tag)) publish([...tags, tag])
    setDraft("")
  }
  return (
    <View
      {...props}
      style={[
        {
          position: "relative",
          minHeight: 48,
          minWidth: 0,
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 6,
          paddingHorizontal: 6,
        },
        style,
      ]}
    >
      <View
        pointerEvents="none"
        testID="tag-input-surface"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 2,
          bottom: 2,
          borderWidth: 1,
          borderColor: focusWithin ? theme.colors.focusRing : theme.colors.border,
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.surface,
          boxShadow: focusWithin
            ? `0px 0px 0px 2px ${alpha(theme.colors.focusRing, 0.25)}`
            : "0px 1px 2px rgba(0,0,0,0.05)",
        }}
      />
      {tags.map((tag, index) => (
        <Pressable
          key={`${index}:${tag}`}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${tag}`}
          disabled={disabled}
          onFocus={() => setFocusedTag(index)}
          onBlur={() => setFocusedTag(null)}
          onPress={() => {
            publish(tags.filter((_, position) => position !== index))
            inputRef.current?.focus()
          }}
          style={({ pressed }) => ({
            maxWidth: "100%",
            minHeight: 48,
            minWidth: 48,
            justifyContent: "center",
            outlineWidth: focusedTag === index && !disabled ? 2 : 0,
            outlineColor: theme.colors.focusRing,
            outlineOffset: 2,
            opacity: pressed && !disabled ? 0.8 : 1,
          })}
        >
          <View
            style={{
              flexDirection: "row",
              maxWidth: "100%",
              alignItems: "center",
              gap: 4,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.sm,
              paddingLeft: 10,
              paddingRight: 4,
              paddingVertical: 4,
              minHeight: 30,
              backgroundColor: theme.colors.disabledSurface,
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                flexShrink: 1,
                fontFamily: theme.fonts?.medium,
                fontWeight: "500",
                fontSize: 13,
                lineHeight: 20,
                color: theme.colors.foreground,
              }}
            >
              {tag}
            </Text>
            <Text
              accessible={false}
              style={{
                width: 24,
                textAlign: "center",
                fontSize: 12,
                lineHeight: 24,
                color: disabled ? theme.colors.disabledForeground : theme.colors.mutedForeground,
              }}
            >
              ×
            </Text>
          </View>
        </Pressable>
      ))}
      <TextInput
        accessibilityLabel="New tag"
        placeholder="Add a tag"
        returnKeyType="done"
        {...inputProps}
        ref={inputRef}
        editable={!inputInactive}
        accessibilityState={{ ...inputProps?.accessibilityState, disabled: inputInactive }}
        aria-disabled={inputInactive}
        underlineColorAndroid={inputProps?.underlineColorAndroid ?? "transparent"}
        value={draft}
        onChangeText={(text) => {
          setDraft(text)
          inputProps?.onChangeText?.(text)
        }}
        onSubmitEditing={(event) => {
          // React Native Web prevents the Enter default before dispatching this event.
          const prevented = event.defaultPrevented
          inputProps?.onSubmitEditing?.(event)
          if (!prevented && event.defaultPrevented) return
          add()
        }}
        onFocus={(event) => {
          setFocused(true)
          inputProps?.onFocus?.(event)
        }}
        onBlur={(event) => {
          setFocused(false)
          inputProps?.onBlur?.(event)
        }}
        placeholderTextColor={
          inputProps?.placeholderTextColor ??
          (inputInactive ? theme.colors.disabledForeground : theme.colors.mutedForeground)
        }
        style={[
          {
            position: "relative",
            flex: 1,
            minHeight: 48,
            minWidth: 80,
            paddingHorizontal: 8,
            paddingVertical: 8,
            borderWidth: 0,
            outlineWidth: 0,
            backgroundColor: "transparent",
            fontSize: 14,
            lineHeight: 20,
            fontFamily: theme.fonts?.regular,
            color: inputInactive ? theme.colors.disabledForeground : theme.colors.foreground,
          },
          inputProps?.style,
        ]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add tag"
        disabled={disabled || !draft.trim()}
        onPress={add}
        onFocus={() => setAddFocused(true)}
        onBlur={() => setAddFocused(false)}
        style={({ pressed }) => ({
          minHeight: 48,
          minWidth: 48,
          paddingHorizontal: 12,
          justifyContent: "center",
          outlineWidth: addFocused && !disabled ? 2 : 0,
          outlineColor: theme.colors.focusRing,
          outlineOffset: 2,
          opacity: disabled || !draft.trim() ? 0.5 : pressed ? 0.8 : 1,
        })}
      >
        <Text
          style={{
            fontSize: 14,
            lineHeight: 14,
            fontWeight: "500",
            fontFamily: theme.fonts?.medium,
            color:
              disabled || !draft.trim()
                ? theme.colors.disabledForeground
                : theme.colors.primaryText,
          }}
        >
          Add
        </Text>
      </Pressable>
      {children}
    </View>
  )
}
