import { useState } from "react"
import { View } from "react-native"
import { NumberField } from "../../../../generated/react-native/number-field"
import { Field, FieldLabel, FieldDescription } from "../../../../generated/react-native/field"
import { Text } from "../../../../generated/react-native/typography"
export default function NumberFieldExample() {
  const [reps, setReps] = useState(8)
  return (
    <View style={{ gap: 16 }}>
      <Field>
        <FieldLabel>Repetitions</FieldLabel>
        <NumberField label="Repetitions" min={1} max={30} value={reps} onValueChange={setReps} />
        <FieldDescription>
          Choose 1–30 reps. Invalid drafts reset when editing ends.
        </FieldDescription>
      </Field>
      <Text accessibilityLiveRegion="polite">Target: {reps} reps</Text>
      <Field>
        <FieldLabel>Weight (kg)</FieldLabel>
        <NumberField label="Weight" min={0} max={500} step={2.5} defaultValue={60} />
      </Field>
      <NumberField label="Locked repetitions" disabled defaultValue={10} />
      <Text testID="native-description" variant="caption" tone="muted">
        Native text entry and 48-unit decrement/increment controls, with explicit bounds and
        disabled state.
      </Text>
    </View>
  )
}
