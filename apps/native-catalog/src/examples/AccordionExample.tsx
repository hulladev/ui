import { useState } from "react"
import { Platform } from "react-native"
import {
  Accordion,
  AccordionItem,
  AccordionTriggerText,
  AccordionContentText,
  AccordionTrigger,
  AccordionContent,
} from "../../../../generated/react-native/accordion"
import { Text } from "../../../../generated/react-native/typography"
export default function AccordionExample() {
  const [open, setOpen] = useState<string | null>("rest")
  const items = [
    {
      id: "rest",
      title: "How long should I rest?",
      body: "Start with 90 seconds between working sets. Take more time when your breathing or technique needs it.",
    },
    {
      id: "warmup",
      title: "Do warm-up sets count?",
      body: "Record warm-up sets separately so working volume stays easy to compare.",
    },
    {
      id: "history",
      title: "Can I change a previous session?",
      body: "Yes. Editing a session updates that entry without rewriting a saved template.",
    },
  ]
  return (
    <>
      <Accordion>
        {items.map((item) => (
          <AccordionItem key={item.id}>
            <AccordionTrigger
              nativeID={`native-${item.id}-trigger`}
              {...(Platform.OS === "web" && open === item.id
                ? { "aria-controls": `native-${item.id}-content` }
                : {})}
              expanded={open === item.id}
              onExpandedChange={(expanded) => setOpen(expanded ? item.id : null)}
              accessibilityLabel={item.title}
            >
              <AccordionTriggerText>{item.title}</AccordionTriggerText>
            </AccordionTrigger>
            <AccordionContent
              open={open === item.id}
              nativeID={`native-${item.id}-content`}
              accessibilityLabel={item.title}
              accessibilityLabelledBy={`native-${item.id}-trigger`}
            >
              <AccordionContentText>{item.body}</AccordionContentText>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Text testID="native-description" variant="caption" tone="muted">
        Each trigger and content part receives state explicitly. This example allows one answer open
        at a time.
      </Text>
    </>
  )
}
