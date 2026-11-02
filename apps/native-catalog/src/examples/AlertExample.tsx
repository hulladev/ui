import { View } from "react-native"
import { Text } from "../../../../generated/react-native/typography"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { useState } from "react"
import { Alert, AlertTitle, AlertDescription } from "../../../../generated/react-native/alert"

export default function AlertExample() {
  const [saved, setSaved] = useState(false)
  return (
    <View style={{ gap: 20 }}>
      <Alert>
        <AlertTitle>Session stays on this device</AlertTitle>
        <AlertDescription>You can continue logging sets while offline.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Check your equipment</AlertTitle>
        <AlertDescription>
          Choose a safe working weight before starting a new exercise.
        </AlertDescription>
      </Alert>
      <Button onPress={() => setSaved(!saved)}>
        <ButtonText>{saved ? "Reset saved state" : "Save session"}</ButtonText>
      </Button>
      {saved && (
        <Alert variant="success" accessibilityRole="alert" accessibilityLiveRegion="polite">
          <AlertTitle>Session saved</AlertTitle>
          <AlertDescription>Your sets are ready for your next visit.</AlertDescription>
        </Alert>
      )}
      <Alert variant="danger">
        <AlertTitle>Sync unavailable</AlertTitle>
        <AlertDescription>
          Your local session is safe. Try syncing again when you reconnect.
        </AlertDescription>
      </Alert>
      <Text testID="native-description" variant="caption" tone="muted">
        Use alert announcements for new feedback; persistent information stays a summary.
      </Text>
    </View>
  )
}
