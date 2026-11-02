import { useState } from "react"
import { View } from "react-native"
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "../../../../generated/react-native/dialog"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { Text } from "../../../../generated/react-native/typography"
export default function DialogExample() {
  const [open, setOpen] = useState(false)
  const [finished, setFinished] = useState(false)
  return (
    <View style={{ gap: 16 }}>
      <Button
        aria-expanded={open}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(true)}
      >
        <ButtonText>Finish workout</ButtonText>
      </Button>
      <Text accessibilityLiveRegion="polite">
        {finished ? "Workout saved." : "Your session is still active."}
      </Text>
      <Dialog visible={open} onClose={() => setOpen(false)} contentLabel="Finish this workout">
        <DialogHeader>
          <DialogTitle>Finish this workout?</DialogTitle>
          <DialogDescription>
            Your completed sets will be saved. You can add notes later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onPress={() => {
              setFinished(true)
              setOpen(false)
            }}
          >
            <ButtonText>Save workout</ButtonText>
          </Button>
          <Button variant="outline" onPress={() => setOpen(false)}>
            <ButtonText variant="outline">Keep training</ButtonText>
          </Button>
        </DialogFooter>
      </Dialog>
      <Text testID="native-description" variant="caption" tone="muted">
        A native modal owns focus and back dismissal. Header and footer share the web typography and
        spacing. contentStyle targets the surface; contentContainerStyle targets the scroll layout.
      </Text>
    </View>
  )
}
