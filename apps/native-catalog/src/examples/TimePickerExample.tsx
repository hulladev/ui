import { useState } from "react"
import { View } from "react-native"
import { TimePicker } from "../../../../generated/react-native/time-picker"
import { Field, FieldLabel } from "../../../../generated/react-native/field"
import { Text } from "../../../../generated/react-native/typography"
export default function TimePickerExample() {
  const [value, setValue] = useState("18:30")
  return (
    <View style={{ gap: 16 }}>
      <Field>
        <FieldLabel>Training reminder</FieldLabel>
        <TimePicker label="Training reminder" value={value} onValueChange={setValue} />
      </Field>
      <Text accessibilityLiveRegion="polite">Reminder: {value}</Text>
      <TimePicker disabled label="Locked reminder" defaultValue="08:00" />
      <Text testID="native-description" variant="caption" tone="muted">
        Local 24-hour time. Hour and minute fields support typing and explicit increment buttons;
        confirm commits the draft.
      </Text>
    </View>
  )
}
