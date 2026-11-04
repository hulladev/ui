import { useState, type ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/theme.react-native"
import { Button } from "../button/button.react-native"
import { ButtonText } from "../button/button-text.react-native"
import { Select } from "../select/select.react-native"
import { SelectText } from "../select/select-text.react-native"
import { NumberField } from "../number-field/number-field.react-native"
import { Dialog } from "../dialog/dialog.react-native"
import { DialogTitle } from "../dialog/dialog-title.react-native"
import { DialogHeader } from "../dialog/dialog-header.react-native"
import { DialogFooter } from "../dialog/dialog-footer.react-native"
import { FieldLabel } from "../field/field-label.react-native"
import { Field } from "../field/field.react-native"

export type TimePickerProps = ComponentPropsWithRef<typeof View> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  label: string
  disabled?: boolean
  theme?: NativeTheme
}

export function TimePicker({
  children,
  style,
  value,
  defaultValue = "09:00",
  onValueChange,
  label,
  disabled = false,
  theme: override,
  ...props
}: TimePickerProps) {
  const theme = useNativeTheme(override)
  const [local, setLocal] = useState(defaultValue)
  const selected = value ?? local
  const normalized = /^([01]\d|2[0-3]):[0-5]\d$/.test(selected) ? selected : "09:00"
  const [open, setOpen] = useState(false)
  const [hours, setHours] = useState(Number(normalized.slice(0, 2)))
  const [minutes, setMinutes] = useState(Number(normalized.slice(3)))
  return (
    <View {...props} style={style}>
      <Select
        theme={theme}
        indicator={
          <View style={{ width: 16, height: 16, alignItems: "center", justifyContent: "center" }}>
            <View
              style={{
                width: 13,
                height: 13,
                borderWidth: 1.25,
                borderRadius: 7,
                borderColor: disabled
                  ? theme.colors.disabledForeground
                  : theme.colors.mutedForeground,
              }}
            />
            <View
              style={{
                position: "absolute",
                left: 7.5,
                top: 4,
                height: 4,
                borderLeftWidth: 1.25,
                borderColor: disabled
                  ? theme.colors.disabledForeground
                  : theme.colors.mutedForeground,
              }}
            />
            <View
              style={{
                position: "absolute",
                left: 8,
                top: 7,
                width: 3.5,
                borderTopWidth: 1.25,
                borderColor: disabled
                  ? theme.colors.disabledForeground
                  : theme.colors.mutedForeground,
                transform: [{ rotate: "35deg" }],
              }}
            />
          </View>
        }
        disabled={disabled}
        expanded={open}
        accessibilityLabel={`${label}: ${normalized}`}
        accessibilityState={{ expanded: open, disabled }}
        aria-expanded={open}
        onPress={() => {
          setHours(Number(normalized.slice(0, 2)))
          setMinutes(Number(normalized.slice(3)))
          setOpen(true)
        }}
      >
        <SelectText theme={theme} disabled={disabled}>
          {normalized}
        </SelectText>
      </Select>
      <Dialog visible={open} onClose={() => setOpen(false)} contentLabel={label} theme={theme}>
        <DialogHeader>
          <DialogTitle theme={theme}>{label}</DialogTitle>
        </DialogHeader>
        <View style={{ gap: 16 }}>
          <Field>
            <FieldLabel theme={theme}>Hour (24-hour clock)</FieldLabel>
            <NumberField
              theme={theme}
              label="Hour"
              min={0}
              max={23}
              value={hours}
              onValueChange={(next) => setHours(Math.trunc(next))}
            />
          </Field>
          <Field>
            <FieldLabel theme={theme}>Minute</FieldLabel>
            <NumberField
              theme={theme}
              label="Minute"
              min={0}
              max={59}
              value={minutes}
              onValueChange={(next) => setMinutes(Math.trunc(next))}
            />
          </Field>
        </View>
        <DialogFooter>
          <Button
            theme={theme}
            onPress={() => {
              const next = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
              if (value === undefined) setLocal(next)
              onValueChange?.(next)
              setOpen(false)
            }}
          >
            <ButtonText theme={theme}>Confirm time</ButtonText>
          </Button>
          <Button theme={theme} variant="ghost" onPress={() => setOpen(false)}>
            <ButtonText theme={theme} variant="ghost">
              Cancel
            </ButtonText>
          </Button>
        </DialogFooter>
      </Dialog>
      {children}
    </View>
  )
}
