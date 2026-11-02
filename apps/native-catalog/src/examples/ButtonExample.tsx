import { useState } from "react"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { View } from "react-native"
import { Text } from "../../../../generated/react-native/typography"

export default function ButtonExample() {
  const [presses, setPresses] = useState(0)
  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        {(["primary", "secondary", "inverted", "outline", "ghost", "danger"] as const).map(
          (variant) => (
            <Button
              key={variant}
              variant={variant}
              onPress={() => setPresses((value) => value + 1)}
            >
              <ButtonText testID="action-label" variant={variant}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </ButtonText>
            </Button>
          )
        )}
        <Button disabled onPress={() => setPresses((value) => value + 100)}>
          <ButtonText disabled>Disabled</ButtonText>
        </Button>
      </View>
      <Text
        testID="native-description"
        variant="caption"
        tone="muted"
        accessibilityLiveRegion="polite"
      >
        Actions triggered: {presses}
      </Text>
    </View>
  )
}
