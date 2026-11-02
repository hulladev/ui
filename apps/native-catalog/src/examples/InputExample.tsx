import { useState } from "react"
import { View } from "react-native"
import { Input } from "../../../../generated/react-native/input"
import { Field, FieldLabel, FieldDescription } from "../../../../generated/react-native/field"
import { Text } from "../../../../generated/react-native/typography"

export default function InputExample() {
  const [name, setName] = useState("")
  return (
    <View style={{ gap: 20 }}>
      <Field>
        <FieldLabel>Display name</FieldLabel>
        <Input
          accessibilityLabel="Display name"
          placeholder="Your name"
          value={name}
          onChangeText={setName}
          autoComplete="name"
          returnKeyType="done"
        />
        <FieldDescription>Use the name you want people to see.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Unavailable input</FieldLabel>
        <Input accessibilityLabel="Read-only input" value="Editing unavailable" editable={false} />
      </Field>
      <Text testID="native-description" variant="caption" tone="muted">
        Native editing, selection, and keyboard behavior. See Textarea for multiline notes.
      </Text>
    </View>
  )
}
