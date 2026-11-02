// Browser catalog adapter. Metro selects pickDocument.native.ts on iOS and Android.
export async function pickDocument(): Promise<{ name: string; size?: number; uri: string } | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input")
    input.type = "file"
    const finish = () => {
      const file = input.files?.[0]
      // The catalog only displays metadata; it does not upload or retain a blob URL.
      resolve(file ? { name: file.name, size: file.size, uri: file.name } : null)
      input.remove()
    }
    input.addEventListener("change", finish, { once: true })
    input.addEventListener("cancel", finish, { once: true })
    input.click()
  })
}
