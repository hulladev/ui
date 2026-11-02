import { useState } from "react"
import { View } from "react-native"
import {
  Drawer,
  DrawerTitle,
  DrawerDescription,
  DrawerHeader,
} from "../../../../generated/react-native/drawer"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { Input } from "../../../../generated/react-native/input"
import { Text } from "../../../../generated/react-native/typography"
export default function DrawerExample() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState("90")
  const [rest, setRest] = useState(90)
  const valid = /^\d+$/.test(draft) && Number(draft) > 0 && Number(draft) <= 600
  return (
    <View style={{ gap: 16 }}>
      <Button
        aria-expanded={open}
        accessibilityState={{ expanded: open }}
        onPress={() => {
          setDraft(String(rest))
          setOpen(true)
        }}
      >
        <ButtonText>Edit rest timer</ButtonText>
      </Button>
      <Text accessibilityLiveRegion="polite">Rest timer: {rest} seconds</Text>
      <Drawer visible={open} onClose={() => setOpen(false)} contentLabel="Rest timer settings">
        <DrawerHeader>
          <DrawerTitle>Rest between sets</DrawerTitle>
          <DrawerDescription>Choose a duration from 1 to 600 seconds.</DrawerDescription>
        </DrawerHeader>
        <Input
          accessibilityLabel="Rest duration in seconds"
          keyboardType="number-pad"
          value={draft}
          onChangeText={setDraft}
        />
        <Button
          disabled={!valid}
          onPress={() => {
            setRest(Number(draft))
            setOpen(false)
          }}
        >
          <ButtonText disabled={!valid}>Apply rest timer</ButtonText>
        </Button>
        <Button variant="ghost" onPress={() => setOpen(false)}>
          <ButtonText variant="ghost">Cancel</ButtonText>
        </Button>
      </Drawer>
      <Text testID="native-description" variant="caption" tone="muted">
        A bottom anchored native modal, with keyboard avoidance, back and backdrop dismissal. No
        swipe gesture is implied.
      </Text>
    </View>
  )
}
