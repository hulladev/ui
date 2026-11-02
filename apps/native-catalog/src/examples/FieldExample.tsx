import { useRef, useState, type ComponentRef } from "react"
import { View } from "react-native"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from "../../../../generated/react-native/field"
import { Input } from "../../../../generated/react-native/input"
import { Checkbox } from "../../../../generated/react-native/checkbox"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { Text } from "../../../../generated/react-native/typography"

export default function FieldExample() {
  const input = useRef<ComponentRef<typeof Input>>(null)
  const [name, setName] = useState("")
  const [warmups, setWarmups] = useState(true)
  const [attempted, setAttempted] = useState(false)
  const [saved, setSaved] = useState(false)
  const error = attempted && !name.trim() ? "Enter a workout name." : ""
  const save = () => {
    setAttempted(true)
    if (!name.trim()) {
      setSaved(false)
      input.current?.focus()
      return
    }
    setSaved(true)
  }
  return (
    <View style={{ gap: 20 }}>
      <Field>
        <FieldLabel nativeID="workout-name-label">Workout name</FieldLabel>
        <Input
          ref={input}
          accessibilityLabel="Workout name"
          accessibilityLabelledBy="workout-name-label"
          accessibilityHint={`Required. ${error || "Use a name you will recognize in your workout list."}`}
          placeholder="e.g. Upper body A"
          value={name}
          onChangeText={(value) => {
            setName(value)
            setSaved(false)
          }}
          invalid={Boolean(error)}
          returnKeyType="done"
          onSubmitEditing={save}
        />
        <FieldDescription>Use a name you will recognize in your workout list.</FieldDescription>
        {error ? <FieldError>{error}</FieldError> : null}
      </Field>
      <Checkbox
        checked={warmups}
        onCheckedChange={setWarmups}
        accessibilityLabel="Include warm-up sets"
      >
        <FieldContent>
          <FieldLabel>Include warm-up sets</FieldLabel>
          <FieldDescription>Keep them separate from working sets.</FieldDescription>
        </FieldContent>
      </Checkbox>
      <Button onPress={save}>
        <ButtonText>Save template</ButtonText>
      </Button>
      <Text testID="native-description" variant="caption" tone="muted">
        Labels, hints, and validation are composed explicitly. Fields do not change their children’s
        state.
      </Text>
      {saved ? <Text accessibilityLiveRegion="polite">Saved {name.trim()}.</Text> : null}
    </View>
  )
}
