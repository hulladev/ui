import { Badge } from "../../../../generated/react-native/badge"
import { View } from "react-native"
import { Text } from "../../../../generated/react-native/typography"

export default function BadgeExample() {
  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {(["neutral", "primary", "success", "warning", "danger"] as const).map((variant) => (
          <Badge key={variant} testID="status-label" variant={variant}>
            {variant}
          </Badge>
        ))}
      </View>
      <Text testID="native-description" variant="caption" tone="muted">
        Status stays readable without relying on color alone.
      </Text>
    </View>
  )
}
