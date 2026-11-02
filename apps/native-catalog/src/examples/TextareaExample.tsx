import { useState } from "react"
import { View } from "react-native"
import { Field, FieldLabel, FieldDescription } from "../../../../generated/react-native/field"
import { Textarea } from "../../../../generated/react-native/textarea"
import { Text } from "../../../../generated/react-native/typography"

export default function TextareaExample() {
  const [notes, setNotes] = useState("")
  return (
    <View style={{ gap: 20 }}>
      <Field>
        <FieldLabel>Session notes</FieldLabel>
        <Textarea
          accessibilityLabel="Session notes"
          accessibilityHint="Optional. Up to 240 characters."
          placeholder="How did the session feel?"
          value={notes}
          onChangeText={setNotes}
          maxLength={240}
        />
        <FieldDescription>{notes.length} / 240 characters</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Previous session</FieldLabel>
        <Textarea
          accessibilityLabel="Previous session"
          value="Good control on the last set. Add a little weight next time."
          editable={false}
        />
      </Field>
      <Text testID="native-description" variant="caption" tone="muted">
        Native multiline editing, selection, text scaling, and keyboard behavior.
      </Text>
    </View>
  )
}
