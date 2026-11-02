import { useState } from "react"
import { View } from "react-native"
import { Checkbox } from "../../../../generated/react-native/checkbox"
import {
  FieldContent,
  FieldLabel,
  FieldDescription,
} from "../../../../generated/react-native/field"
import { Text } from "../../../../generated/react-native/typography"

export default function CheckboxExample() {
  const [checked, setChecked] = useState(false)
  const [mixed, setMixed] = useState<boolean | "mixed">("mixed")
  return (
    <View style={{ gap: 12 }}>
      <Checkbox
        checked={checked}
        onCheckedChange={setChecked}
        accessibilityLabel="Mark set complete"
      >
        <FieldContent>
          <FieldLabel>Mark set complete</FieldLabel>
          <FieldDescription>Bench press · 8 reps · 60 kg</FieldDescription>
        </FieldContent>
      </Checkbox>
      <Text accessibilityLiveRegion="polite">
        {checked ? "Set completed" : "Set not completed"}
      </Text>
      <Checkbox
        checked={mixed}
        onCheckedChange={setMixed}
        accessibilityLabel="Select all exercises"
      >
        <Text>Select all exercises</Text>
      </Checkbox>
      <Checkbox defaultChecked accessibilityLabel="Remember equipment">
        <Text>Remember equipment</Text>
      </Checkbox>
      <Checkbox disabled defaultChecked accessibilityLabel="Locked completed set">
        <Text tone="muted">Locked completed set</Text>
      </Checkbox>
      <Checkbox disabled accessibilityLabel="Unavailable exercise">
        <Text tone="muted">Unavailable exercise</Text>
      </Checkbox>
      <Checkbox
        invalid
        accessibilityLabel="Required confirmation"
        accessibilityHint="Select this option to continue."
      >
        <Text>Required confirmation</Text>
      </Checkbox>
      <Text testID="native-description" variant="caption" tone="muted">
        18-unit indicators inside 48-unit touch targets. A mixed selection becomes checked on
        activation.
      </Text>
    </View>
  )
}
