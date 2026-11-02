import { useState } from "react"
import { View } from "react-native"
import {
  FileUpload,
  FileUploadTrigger,
  FileUploadItem,
  FileUploadName,
  FileUploadDescription,
  FileUploadRemove,
  FileUploadTriggerLabel,
  FileUploadRemoveLabel,
} from "../../../../generated/react-native/file-upload"
import { Text } from "../../../../generated/react-native/typography"
import { pickDocument } from "../platform/pickDocument"

type Attachment = { name: string; size?: number; uri: string }

export default function FileUploadExample() {
  const [files, setFiles] = useState<Attachment[]>([
    { name: "workout-plan.txt", size: 128, uri: "fixture:workout-plan" },
  ])
  const [picking, setPicking] = useState(false)
  const [status, setStatus] = useState(
    "One example attachment is ready. Choose a document to attach a real file."
  )
  const [error, setError] = useState(false)
  async function attach() {
    if (picking) return
    setPicking(true)
    setError(false)
    try {
      const file = await pickDocument()
      if (file) {
        setFiles((previous) => [...previous.filter((entry) => entry.uri !== file.uri), file])
        setStatus(`Attached ${file.name}.`)
      } else setStatus("Document selection cancelled.")
    } catch {
      setError(true)
      setStatus("Could not open this document. Please try again.")
    } finally {
      setPicking(false)
    }
  }
  return (
    <View style={{ gap: 20 }}>
      <FileUpload>
        <FileUploadTrigger
          accessibilityLabel="Attach document"
          disabled={picking}
          accessibilityState={{ busy: picking }}
          onPress={() => {
            void attach()
          }}
        >
          <FileUploadTriggerLabel disabled={picking}>
            {picking ? "Choosing document…" : "Attach document"}
          </FileUploadTriggerLabel>
        </FileUploadTrigger>
        <FileUploadDescription>
          Choose a training plan or notes from your device. Files stay in this preview.
        </FileUploadDescription>
        {files.map((file) => (
          <FileUploadItem key={file.uri}>
            <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
              <FileUploadName>{file.name}</FileUploadName>
              <FileUploadDescription>
                {file.size === undefined ? "Document" : `${file.size} bytes`}
              </FileUploadDescription>
            </View>
            <FileUploadRemove
              accessibilityLabel={`Remove ${file.name}`}
              onPress={() => {
                setFiles((previous) => previous.filter((entry) => entry.uri !== file.uri))
                setError(false)
                setStatus(`Removed ${file.name}.`)
              }}
            >
              <FileUploadRemoveLabel>Remove</FileUploadRemoveLabel>
            </FileUploadRemove>
          </FileUploadItem>
        ))}
      </FileUpload>
      <Text
        accessibilityRole={error ? "alert" : undefined}
        accessibilityLiveRegion="polite"
        tone={error ? "danger" : "muted"}
      >
        {status}
      </Text>
      <Text testID="native-description" variant="caption" tone="muted">
        The application supplies the document picker. These parts do not require Expo or upload
        files automatically.
      </Text>
    </View>
  )
}
