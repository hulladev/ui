import { useState, type ComponentPropsWithRef } from "react"
import { View } from "react-native"
import { useNativeTheme, type NativeTheme } from "@/lib/native-theme"
import { nativeDateDisabled, parseNativeDate } from "@/lib/native-date"
import { Button } from "../button/button.react-native"
import { ButtonText } from "../button/button-text.react-native"
import { Select } from "../select/select.react-native"
import { SelectText } from "../select/select-text.react-native"
import { Calendar } from "../calendar/calendar.react-native"
import { Drawer } from "../drawer/drawer.react-native"
import { DrawerTitle } from "../drawer/drawer-title.react-native"

export type DatePickerProps = ComponentPropsWithRef<typeof View> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  label: string
  placeholder?: string
  min?: string
  max?: string
  disabled?: boolean
  locale?: string
  theme?: NativeTheme
}

export function DatePicker({
  children,
  style,
  value,
  defaultValue,
  onValueChange,
  label,
  placeholder = "Choose date",
  min,
  max,
  disabled = false,
  locale = "en",
  theme: override,
  ...props
}: DatePickerProps) {
  const theme = useNativeTheme(override)
  const [local, setLocal] = useState(defaultValue)
  const selected = value ?? local
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(selected)
  const parsed = parseNativeDate(selected)
  const validDraft = Boolean(
    parseNativeDate(draft) && draft && !nativeDateDisabled(draft, min, max)
  )
  return (
    <View {...props} style={style}>
      <Select
        theme={theme}
        indicator={
          <View style={{ width: 16, height: 16 }}>
            <View
              style={{
                position: "absolute",
                left: 2,
                top: 4,
                width: 12,
                height: 11,
                borderWidth: 1.25,
                borderRadius: 1,
                borderColor: disabled
                  ? theme.colors.disabledForeground
                  : theme.colors.mutedForeground,
              }}
            />
            <View
              style={{
                position: "absolute",
                left: 2,
                top: 7,
                width: 12,
                borderTopWidth: 1.25,
                borderColor: disabled
                  ? theme.colors.disabledForeground
                  : theme.colors.mutedForeground,
              }}
            />
            <View
              style={{
                position: "absolute",
                left: 5,
                top: 1,
                height: 5,
                borderLeftWidth: 1.25,
                borderColor: disabled
                  ? theme.colors.disabledForeground
                  : theme.colors.mutedForeground,
              }}
            />
            <View
              style={{
                position: "absolute",
                right: 5,
                top: 1,
                height: 5,
                borderLeftWidth: 1.25,
                borderColor: disabled
                  ? theme.colors.disabledForeground
                  : theme.colors.mutedForeground,
              }}
            />
          </View>
        }
        disabled={disabled}
        expanded={open}
        accessibilityLabel={`${label}: ${parsed ? parsed.toLocaleDateString(locale, { dateStyle: "long" }) : placeholder}`}
        accessibilityState={{ expanded: open, disabled }}
        aria-expanded={open}
        onPress={() => {
          setDraft(selected)
          setOpen(true)
        }}
      >
        <SelectText
          theme={theme}
          disabled={disabled}
          style={
            !parsed
              ? { color: disabled ? theme.colors.disabledForeground : theme.colors.mutedForeground }
              : undefined
          }
        >
          {parsed ? parsed.toLocaleDateString(locale, { dateStyle: "medium" }) : placeholder}
        </SelectText>
      </Select>
      <Drawer
        visible={open}
        onClose={() => setOpen(false)}
        contentLabel={label}
        theme={theme}
        contentContainerStyle={{ padding: 12, paddingBottom: 32, gap: 16 }}
      >
        <DrawerTitle theme={theme}>{label}</DrawerTitle>
        <Calendar
          key={open ? "open" : "closed"}
          theme={theme}
          value={draft ?? ""}
          defaultMonth={draft ?? min}
          min={min}
          max={max}
          locale={locale}
          onValueChange={setDraft}
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Button
            theme={theme}
            disabled={!validDraft}
            onPress={() => {
              if (!draft || !validDraft) return
              if (value === undefined) setLocal(draft)
              onValueChange?.(draft)
              setOpen(false)
            }}
          >
            <ButtonText theme={theme} disabled={!validDraft}>
              Confirm date
            </ButtonText>
          </Button>
          <Button theme={theme} variant="ghost" onPress={() => setOpen(false)}>
            <ButtonText theme={theme} variant="ghost">
              Cancel
            </ButtonText>
          </Button>
        </View>
      </Drawer>
      {children}
    </View>
  )
}
