import { useState, type ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { Button } from "../button/button.react-native"
import { ButtonText } from "../button/button-text.react-native"
import { Input } from "../input/input.react-native"

export type NumberFieldProps = Omit<ComponentPropsWithRef<typeof View>, "onChange"> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  label: string
  theme?: NativeTheme
}

export function NumberField({
  children,
  style,
  value,
  defaultValue = 0,
  onValueChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  disabled = false,
  label,
  theme: override,
  ...props
}: NumberFieldProps) {
  const theme = useNativeTheme(override)
  const low = Number.isFinite(min) ? min : -Infinity
  const high = Number.isFinite(max) ? Math.max(low, max) : Infinity
  const increment = Number.isFinite(step) && step > 0 ? step : 1
  const clamp = (number: number) =>
    Math.min(high, Math.max(low, Number.isFinite(number) ? number : 0))
  const [local, setLocal] = useState(defaultValue)
  const current = clamp(value ?? local)
  const [draft, setDraft] = useState<string | null>(null)
  const update = (number: number) => {
    const next = clamp(Math.round(number * 1e8) / 1e8)
    if (value === undefined) setLocal(next)
    onValueChange?.(next)
    setDraft(null)
  }
  const commit = () => {
    if (draft !== null && draft.trim() !== "" && Number.isFinite(Number(draft)))
      update(Number(draft))
    else setDraft(null)
  }
  const decrementDisabled = disabled || current <= low
  const incrementDisabled = disabled || current >= high
  return (
    <View {...props} style={[{ flexDirection: "row", alignItems: "center", gap: 8 }, style]}>
      <Button
        theme={theme}
        variant="outline"
        disabled={decrementDisabled}
        accessibilityLabel={`Decrease ${label}`}
        onPress={() => update(current - increment)}
      >
        <ButtonText theme={theme} variant="outline" disabled={decrementDisabled}>
          −
        </ButtonText>
      </Button>
      <Input
        theme={theme}
        accessibilityLabel={label}
        keyboardType="decimal-pad"
        editable={!disabled}
        value={draft ?? String(current)}
        onChangeText={setDraft}
        onBlur={commit}
        onSubmitEditing={commit}
        style={{ flex: 1, minWidth: 64, textAlign: "center" }}
      />
      <Button
        theme={theme}
        variant="outline"
        disabled={incrementDisabled}
        accessibilityLabel={`Increase ${label}`}
        onPress={() => update(current + increment)}
      >
        <ButtonText theme={theme} variant="outline" disabled={incrementDisabled}>
          +
        </ButtonText>
      </Button>
      {children}
    </View>
  )
}
