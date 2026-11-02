import { createElement, type ComponentType } from "react"
import { flushSync } from "react-dom"
import { createRoot, type Root } from "react-dom/client"

type PreviewModule = { default: ComponentType }
type Mount = { family: string; pending: Promise<void>; root?: Root }

const previews = import.meta.glob<PreviewModule>("../components/previews/native/Native*Preview.tsx")
const mounts = new WeakMap<HTMLElement, Mount>()

export function unmountNativePreview(host: HTMLElement): void {
  const mount = mounts.get(host)
  // Invalidate pending imports before unmounting effects or clearing the container.
  mounts.delete(host)
  mount?.root?.unmount()
  host.replaceChildren()
}

export function mountNativePreview(host: HTMLElement, family: string): Promise<void> {
  const existing = mounts.get(host)
  if (existing?.family === family) return existing.pending
  if (existing) unmountNativePreview(host)

  const name = family
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
  const load = previews[`../components/previews/native/Native${name}Preview.tsx`]
  if (!load) return Promise.reject(new Error(`Unknown native preview: ${family}`))

  const mount: Mount = { family, pending: Promise.resolve() }
  mounts.set(host, mount)
  mount.pending = (async () => {
    try {
      const { default: Preview } = await load()
      if (mounts.get(host) !== mount) return
      if (!host.isConnected) {
        mounts.delete(host)
        return
      }
      host.replaceChildren()
      mount.root = createRoot(host)
      // This imperative Astro handoff resolves only after the React canvas has committed.
      flushSync(() => mount.root!.render(createElement(Preview)))
    } catch (error) {
      if (mounts.get(host) === mount) unmountNativePreview(host)
      throw error
    }
  })()
  return mount.pending
}
