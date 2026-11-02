import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../../generated/react-native/card"
import { Field, FieldLabel, FieldDescription } from "../../../../generated/react-native/field"
import { Input } from "../../../../generated/react-native/input"
import { Checkbox } from "../../../../generated/react-native/checkbox"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { Text } from "../../../../generated/react-native/typography"

export default function CardExample() {
  const [name, setName] = useState("Upper body A")
  const [reminder, setReminder] = useState(true)
  const [saved, setSaved] = useState(false)
  const disabled = !name.trim()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout template</CardTitle>
        <CardDescription>A reusable starting point for your next session.</CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldLabel>Template name</FieldLabel>
          <Input
            accessibilityLabel="Template name"
            accessibilityHint="Change the name without changing your previous sessions."
            value={name}
            onChangeText={(value) => {
              setName(value)
              setSaved(false)
            }}
          />
          <FieldDescription>
            Change the name without changing your previous sessions.
          </FieldDescription>
        </Field>
        <Checkbox
          checked={reminder}
          onCheckedChange={setReminder}
          accessibilityLabel="Rest timer reminder"
        >
          <Text>Rest timer reminder</Text>
        </Checkbox>
      </CardContent>
      <CardFooter>
        <Button onPress={() => setSaved(true)} disabled={disabled}>
          <ButtonText disabled={disabled}>Save changes</ButtonText>
        </Button>
        <Text accessibilityLiveRegion="polite" variant="caption" tone="muted">
          {saved ? `Saved ${name.trim()}.` : "Changes stay in this preview."}
        </Text>
      </CardFooter>
      <Text testID="native-description" variant="caption" tone="muted">
        Header, content, and footer are independent parts. Theme and native props stay available.
      </Text>
    </Card>
  )
}
