import { getDocumentAsync } from "expo-document-picker"

export async function pickDocument(): Promise<{ name: string; size?: number; uri: string } | null> {
  const result = await getDocumentAsync({ copyToCacheDirectory: true, multiple: false })
  if (result.canceled) return null
  const asset = result.assets[0]
  return asset ? { name: asset.name, size: asset.size, uri: asset.uri } : null
}
