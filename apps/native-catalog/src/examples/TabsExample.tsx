import { useRef, useState, type ComponentProps, type ComponentRef } from "react"
import { Platform } from "react-native"
import { TabsList, Tab, TabText, TabsContent } from "../../../../generated/react-native/tabs"
import { Text } from "../../../../generated/react-native/typography"
export default function TabsExample() {
  const [tab, setTab] = useState(0)
  const refs = useRef<(ComponentRef<typeof Tab> | null)[]>([])
  const labels = ["Overview", "Exercises", "History"]
  const navigate =
    (index: number): NonNullable<ComponentProps<typeof Tab>["onKeyDown"]> =>
    (event) => {
      const key = (event.nativeEvent as { key?: string }).key
      let next: number | undefined
      if (key === "ArrowRight") next = (index + 1) % labels.length
      if (key === "ArrowLeft") next = (index + labels.length - 1) % labels.length
      if (key === "Home") next = 0
      if (key === "End") next = labels.length - 1
      if (next !== undefined) {
        event.preventDefault()
        setTab(next)
        refs.current[next]?.focus()
      }
    }
  return (
    <>
      <TabsList accessibilityLabel="Workout details">
        {labels.map((label, index) => (
          <Tab
            key={label}
            ref={(element) => {
              refs.current[index] = element
            }}
            nativeID={`workout-tab-${index}`}
            {...(Platform.OS === "web" ? { "aria-controls": `workout-panel-${index}` } : {})}
            selected={tab === index}
            onPress={() => setTab(index)}
            onKeyDown={navigate(index)}
            tabIndex={tab === index ? 0 : -1}
            accessibilityLabel={label}
          >
            <TabText selected={tab === index}>{label}</TabText>
          </Tab>
        ))}
      </TabsList>
      <TabsContent
        selected={tab === 0}
        nativeID="workout-panel-0"
        accessibilityLabel="Overview"
        accessibilityLabelledBy="workout-tab-0"
      >
        <Text>Upper body A</Text>
        <Text tone="muted">4 exercises · about 45 minutes</Text>
      </TabsContent>
      <TabsContent
        selected={tab === 1}
        nativeID="workout-panel-1"
        accessibilityLabel="Exercises"
        accessibilityLabelledBy="workout-tab-1"
      >
        <Text>Bench press, row, overhead press, pulldown.</Text>
      </TabsContent>
      <TabsContent
        selected={tab === 2}
        nativeID="workout-panel-2"
        accessibilityLabel="History"
        accessibilityLabelledBy="workout-tab-2"
      >
        <Text>Last completed Monday.</Text>
      </TabsContent>
      <Text testID="native-description" variant="caption" tone="muted">
        Tab selection and panel visibility are explicit. The example supplies roving focus and
        Arrow, Home, and End navigation. Inactive panels keep their local state while hidden.
      </Text>
    </>
  )
}
