import { View } from "react-native"
import { Text } from "../../../../generated/react-native/typography"
import { Button, ButtonText } from "../../../../generated/react-native/button"
import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "../../../../generated/react-native/avatar"

const sampleImage =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAIAAAADnC86AAAAdklEQVR4nO3NwQ1AUBAE0N+HMpwUoApn0ZKDYimAb3d2JhKZ5N1f2/bjE82xY8eOHTt27Njxj+NxWaWGab6ljZ9WbdxZhXF/VcWvqySOrPw4uJLj+MqMUystzq6cGFgJMbZWY3gtxZUVj4srGNdXJKas6Zi1Xk5U9shAIHV55wAAAABJRU5ErkJggg=="

export default function AvatarExample() {
  const [failed, setFailed] = useState(false)
  const [invalid, setInvalid] = useState(false)
  return (
    <View style={{ gap: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Avatar accessibilityLabel="Alex Morgan">
          <AvatarImage accessibilityLabel="Alex Morgan avatar" source={{ uri: sampleImage }} />
        </Avatar>
        <Text>Loaded image</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Avatar accessible accessibilityRole="image" accessibilityLabel="Sam Lee">
          <AvatarFallback>SL</AvatarFallback>
        </Avatar>
        <Text>Initials when no image is available</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Avatar accessible accessibilityRole="image" accessibilityLabel="Jordan Kim">
          {failed || !invalid ? (
            <AvatarFallback>JK</AvatarFallback>
          ) : (
            <AvatarImage
              source={{ uri: "data:image/png;base64,invalid" }}
              onError={() => setFailed(true)}
            />
          )}
        </Avatar>
        <Text accessibilityLiveRegion="polite">
          {failed ? "Image failed; initials remain available." : "Fallback is explicit."}
        </Text>
      </View>
      <Button
        variant="outline"
        onPress={() => {
          setFailed(false)
          setInvalid(true)
        }}
      >
        <ButtonText variant="outline">Try unavailable image</ButtonText>
      </Button>
      <Text testID="native-description" variant="caption" tone="muted">
        Image events remain native. The application chooses when to render a fallback.
      </Text>
    </View>
  )
}
