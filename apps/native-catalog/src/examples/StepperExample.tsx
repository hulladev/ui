import { useState } from "react"
import { Stepper, StepperItem, StepperText } from "../../../../generated/react-native/stepper"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { Text } from "../../../../generated/react-native/typography"
export default function StepperExample() {
  const [current, setCurrent] = useState(0)
  const labels = ["Choose a template", "Review exercises", "Start training"]
  return (
    <>
      <Stepper accessibilityLabel="Start a workout">
        {labels.map((label, index) => (
          <StepperItem
            key={label}
            step={index + 1}
            status={index < current ? "complete" : index === current ? "current" : "upcoming"}
            onPress={() => setCurrent(index)}
            accessibilityLabel={`${label}, ${index < current ? "complete" : index === current ? "current" : "upcoming"}`}
          >
            <StepperText
              status={index < current ? "complete" : index === current ? "current" : "upcoming"}
            >
              {label}
            </StepperText>
          </StepperItem>
        ))}
      </Stepper>
      <Button onPress={() => setCurrent(Math.min(2, current + 1))} disabled={current === 2}>
        <ButtonText disabled={current === 2}>Next step</ButtonText>
      </Button>
      <Text testID="native-description" variant="caption" tone="muted">
        Multi-step progress shares the web component's purpose. Applications own navigation and mark
        each step explicitly.
      </Text>
    </>
  )
}
