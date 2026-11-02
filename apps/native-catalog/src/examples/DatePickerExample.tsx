import { useState } from "react"
import { View } from "react-native"
import { DatePicker } from "../../../../generated/react-native/date-picker"
import { Field, FieldLabel } from "../../../../generated/react-native/field"
import { Text } from "../../../../generated/react-native/typography"
export default function DatePickerExample() {
  const [value, setValue] = useState("2026-10-29")
  return (
    <View style={{ gap: 16 }}>
      <Field>
        <FieldLabel>Next workout</FieldLabel>
        <DatePicker
          label="Next workout"
          value={value}
          onValueChange={setValue}
          min="2026-10-01"
          max="2026-12-31"
        />
      </Field>
      <Text accessibilityLiveRegion="polite">Scheduled: {value}</Text>
      <DatePicker disabled label="Locked workout date" defaultValue="2026-10-28" />
      <Text testID="native-description" variant="caption" tone="muted">
        Tap to choose, confirm to commit, or cancel to retain the previous date. Dates are local ISO
        strings without timezone conversion.
      </Text>
    </View>
  )
}
