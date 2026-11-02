import { useState } from "react"
import { ScrollView, View } from "react-native"
import { KeyboardAware } from "../../../../generated/react-native/keyboard-aware"
import { Field, FieldLabel } from "../../../../generated/react-native/field"
import { Input } from "../../../../generated/react-native/input"
import { Textarea } from "../../../../generated/react-native/textarea"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { Text } from "../../../../generated/react-native/typography"
export default function KeyboardAwareExample() {
  const [saved, setSaved] = useState(false)
  return (
    <View style={{ gap: 16 }}>
      <KeyboardAware keyboardVerticalOffset={0} style={{ height: 360 }}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 16 }}>
          <Field>
            <FieldLabel>Workout name</FieldLabel>
            <Input
              accessibilityLabel="Keyboard aware workout name"
              placeholder="Evening workout"
              onChangeText={() => setSaved(false)}
            />
          </Field>
          <Field>
            <FieldLabel>Notes</FieldLabel>
            <Textarea
              accessibilityLabel="Keyboard aware session notes"
              placeholder="How did it feel?"
              onChangeText={() => setSaved(false)}
            />
          </Field>
          <Button onPress={() => setSaved(true)}>
            <ButtonText>Save session</ButtonText>
          </Button>
          <Text accessibilityLiveRegion="polite">
            {saved ? "Session saved." : "Edit either field, then save."}
          </Text>
        </ScrollView>
      </KeyboardAware>
      <Text testID="native-description" variant="caption" tone="muted">
        Direct KeyboardAvoidingView props and a scrollable form. Set keyboardVerticalOffset for your
        navigation header; Android follows the host window resize policy. Device keyboard behavior
        needs a native run.
      </Text>
    </View>
  )
}
