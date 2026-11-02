import { View } from "react-native"
import { Text } from "../../../../generated/react-native/typography"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { useState } from "react"
import { Skeleton } from "../../../../generated/react-native/skeleton"

export default function SkeletonExample() {
  const [loading, setLoading] = useState(true)
  return (
    <View style={{ gap: 20 }}>
      <Button variant="outline" onPress={() => setLoading(!loading)}>
        <ButtonText variant="outline">
          {loading ? "Show loaded content" : "Show loading state"}
        </ButtonText>
      </Button>
      <View
        accessibilityLabel="Workout summary"
        accessibilityState={{ busy: loading }}
        aria-busy={loading}
        style={{ gap: 12, minHeight: 100 }}
      >
        {loading ? (
          <>
            <Skeleton style={{ width: "60%", height: 24 }} />
            <Skeleton style={{ width: "90%" }} />
            <Skeleton style={{ width: "75%" }} />
          </>
        ) : (
          <>
            <Text variant="heading">Upper body A</Text>
            <Text>6 exercises · 18 sets</Text>
            <Text tone="muted">Last completed on Tuesday.</Text>
          </>
        )}
      </View>
      <Text accessibilityLiveRegion="polite" variant="caption" tone="muted">
        {loading ? "Loading workout summary." : "Workout summary loaded."}
      </Text>
      <Text testID="native-description" variant="caption" tone="muted">
        Skeleton geometry follows the content it reserves. Decorative placeholders stay outside the
        accessibility tree and do not animate.
      </Text>
    </View>
  )
}
