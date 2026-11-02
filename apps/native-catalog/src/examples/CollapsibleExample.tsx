import { useState } from "react"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleTriggerText,
  CollapsibleContent,
} from "../../../../generated/react-native/collapsible"
import { Text } from "../../../../generated/react-native/typography"
export default function CollapsibleExample() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Collapsible>
        <CollapsibleTrigger
          expanded={open}
          onExpandedChange={setOpen}
          accessibilityLabel="Show previous session"
        >
          <CollapsibleTriggerText>Previous session</CollapsibleTriggerText>
        </CollapsibleTrigger>
        <CollapsibleContent open={open}>
          <Text>Bench press · 3 × 8 at 60 kg</Text>
          <Text tone="muted">Last trained Monday. Final set felt controlled.</Text>
        </CollapsibleContent>
      </Collapsible>
      <Text testID="native-description" variant="caption" tone="muted">
        A visible, named disclosure. Closed content is unmounted and removed from the accessibility
        tree.
      </Text>
    </>
  )
}
