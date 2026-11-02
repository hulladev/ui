import { Spinner } from "../../../../generated/react-native/spinner"
import { View } from "react-native"
import { Text } from "../../../../generated/react-native/typography"

export default function SpinnerExample() {
  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 24 }}>
        <Spinner accessibilityLabel="Loading" />
        <Spinner size="large" accessibilityLabel="Loading larger indicator" />
      </View>
      <Text testID="native-description" variant="caption" tone="muted">
        Activity uses the platform indicator.
      </Text>
    </View>
  )
}
