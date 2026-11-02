import { View } from "react-native"
import { Text } from "../../../../generated/react-native/typography"

export default function TypographyExample() {
  return (
    <View style={{ gap: 16 }}>
      <Text variant="heading">A clear hierarchy</Text>
      <Text testID="native-description">A familiar voice for everyday interfaces.</Text>
      <Text variant="caption" tone="muted">
        Supporting information stays quiet and readable.
      </Text>
      <Text variant="code">0123456789 · 48 / 128</Text>
    </View>
  )
}
