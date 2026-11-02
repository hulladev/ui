import { useState } from "react"
import { View } from "react-native"
import { Toast, ToastTitle, ToastDescription } from "../../../../generated/react-native/toast"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { Text } from "../../../../generated/react-native/typography"
export default function ToastExample() {
  const [notice, setNotice] = useState(0)
  const [visible, setVisible] = useState(true)
  const [duration, setDuration] = useState(0)
  const [status, setStatus] = useState("Your last set was removed.")
  function show(timed: boolean) {
    setNotice((value) => value + 1)
    setDuration(timed ? 2500 : 0)
    setStatus("Your last set was removed.")
    setVisible(true)
  }
  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        <Button onPress={() => show(false)}>
          <ButtonText>Show notice</ButtonText>
        </Button>
        <Button variant="outline" onPress={() => show(true)}>
          <ButtonText variant="outline">Show timed notice</ButtonText>
        </Button>
      </View>
      <Toast
        key={notice}
        visible={visible}
        duration={duration}
        onDismiss={() => setVisible(false)}
        announcement="Set removed. Undo is available."
      >
        <ToastTitle>Set removed</ToastTitle>
        <ToastDescription>Undo restores it to this session.</ToastDescription>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          <Button
            variant="outline"
            onPress={() => {
              setVisible(false)
              setStatus("Your set was restored.")
            }}
          >
            <ButtonText variant="outline">Undo removal</ButtonText>
          </Button>
          <Button variant="ghost" onPress={() => setVisible(false)}>
            <ButtonText variant="ghost">Dismiss notice</ButtonText>
          </Button>
        </View>
      </Toast>
      <Text accessibilityLiveRegion="polite">{status}</Text>
      <Text testID="native-description" variant="caption" tone="muted">
        Notices announce on native devices, pause during focus or touch, and require explicit
        dismissal with a screen reader. This example owns placement and undo.
      </Text>
    </View>
  )
}
