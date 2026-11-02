type NativeRuntime = typeof import("./native-preview-runtime")
type Visibility = {
  element: HTMLElement
  hidden: boolean
  display: string
  priority: string
}
type PreviewState = {
  preview: HTMLElement
  inspector: HTMLElement
  host: HTMLElement
  hostDisplay: string
  hostPriority: string
  family: string
  web: Visibility[]
  native?: boolean
  revision: number
}

const states = new Map<HTMLElement, PreviewState>()
let initialized = false
let documentReady = document.readyState === "complete"
let runtime: NativeRuntime | undefined
let runtimePromise: Promise<NativeRuntime> | undefined
let activatedLocation: string | undefined

const loadRuntime = () =>
  (runtimePromise ??= (async () => {
    // Astro-only pages have no island to initialize the React integration's
    // development preamble. Run its real hydration setup before importing JSX.
    // eslint-disable-next-line turbo/no-undeclared-env-vars -- DEV is a Vite compile-time constant.
    if (import.meta.env.DEV) await import("astro:scripts/before-hydration.js")
    return import("./native-preview-runtime")
  })().then(
    (module) => (runtime = module),
    (error) => {
      runtimePromise = undefined
      throw error
    }
  ))

function visibility(element: HTMLElement): Visibility {
  return {
    element,
    hidden: element.hidden,
    display: element.style.getPropertyValue("display"),
    priority: element.style.getPropertyPriority("display"),
  }
}

function display(element: HTMLElement, value: string, priority = "") {
  if (value) element.style.setProperty("display", value, priority)
  else element.style.removeProperty("display")
}

function showStatus(state: PreviewState, failed = false) {
  const message = document.createElement("p")
  message.dataset.nativePreviewStatus = failed ? "error" : "loading"
  message.setAttribute("role", failed ? "alert" : "status")
  message.textContent = failed ? "Native preview could not load." : "Loading native preview…"
  state.host.replaceChildren(message)
  if (failed) {
    const retry = document.createElement("button")
    retry.type = "button"
    retry.textContent = "Retry native preview"
    retry.addEventListener("click", () => {
      if (states.get(state.preview) !== state || !state.native) return
      state.native = undefined
      selectFramework(state, "React Native")
    })
    state.host.append(retry)
  }
}

function selectFramework(state: PreviewState, framework: string) {
  const native = framework === "React Native"
  if (state.native === native) return
  state.native = native
  const revision = ++state.revision
  state.preview.dataset.previewFramework = native ? "React Native" : "Astro"
  const label = state.preview.querySelector<HTMLElement>("[data-preview-canvas-label]")
  if (label) label.textContent = native ? "Live canvas · React Native" : "Web canvas · Astro"

  for (const item of state.web) {
    item.element.hidden = native || item.hidden
    display(item.element, native ? "none" : item.display, native ? "" : item.priority)
  }
  state.host.hidden = !native
  display(state.host, native ? state.hostDisplay : "none", native ? state.hostPriority : "")
  if (!native) {
    state.host.removeAttribute("aria-busy")
    if (runtime) runtime.unmountNativePreview(state.host)
    else state.host.replaceChildren()
    return
  }

  state.host.setAttribute("aria-busy", "true")
  showStatus(state)
  const current = () =>
    states.get(state.preview) === state &&
    state.native === true &&
    state.revision === revision &&
    state.host.isConnected
  void (async () => {
    try {
      const module = await loadRuntime()
      if (!current()) return
      await module.mountNativePreview(state.host, state.family)
      if (current()) state.host.removeAttribute("aria-busy")
    } catch (error) {
      if (!current()) return
      console.error(`Could not load the ${state.family} native preview.`, error)
      state.host.removeAttribute("aria-busy")
      showStatus(state, true)
    }
  })()
}

function teardown() {
  for (const state of states.values()) {
    state.native = false
    state.revision++
    runtime?.unmountNativePreview(state.host)
  }
  states.clear()
  activatedLocation = undefined
}

function scan() {
  for (const [preview, state] of states) {
    if (preview.isConnected) continue
    state.native = false
    state.revision++
    runtime?.unmountNativePreview(state.host)
    states.delete(preview)
  }
  for (const preview of document.querySelectorAll<HTMLElement>(
    "[data-component-preview][data-native-family]"
  )) {
    if (states.has(preview)) continue
    const host = preview.querySelector<HTMLElement>("[data-native-preview-host]")
    const web = preview.querySelector<HTMLElement>("[data-web-preview]")
    const inspector = preview
      .closest(".workbench")
      ?.querySelector<HTMLElement>("[data-source-inspector]")
    const family = preview.dataset.nativeFamily
    if (!host || !web || !inspector || !family) continue
    const state: PreviewState = {
      preview,
      inspector,
      host,
      hostDisplay: host.style.getPropertyValue("display"),
      hostPriority: host.style.getPropertyPriority("display"),
      family,
      web: [
        web,
        ...preview.querySelectorAll<HTMLElement>(
          "[data-preview-mode-controls], [data-web-preview-facts], [data-web-preview-hint]"
        ),
      ].map(visibility),
      revision: 0,
    }
    states.set(preview, state)
    selectFramework(
      state,
      inspector.dataset.sourceFramework ??
        inspector.querySelector<HTMLSelectElement>("[data-source-framework-select]")?.value ??
        "Astro"
    )
  }
}

function activateQueryTarget() {
  if (!documentReady) return
  const url = new URL(window.location.href)
  if (url.searchParams.get("framework") !== "react-native" || !url.hash) return
  const location = `${url.pathname}${url.search}${url.hash}`
  if (activatedLocation === location) return
  let id: string
  try {
    id = decodeURIComponent(url.hash.slice(1))
  } catch {
    return
  }
  const section = document.getElementById(id)?.closest<HTMLElement>(".component-section")
  if (!section) return
  const preview = section.querySelector<HTMLElement>("[data-component-preview][data-native-family]")
  const state = preview ? states.get(preview) : undefined
  const select = state?.inspector.querySelector<HTMLSelectElement>("[data-source-framework-select]")
  if (!select || !Array.from(select.options).some((option) => option.value === "React Native"))
    return
  activatedLocation = location
  // The source loader captures this event, initializes if needed, and replays the selection.
  select.value = "React Native"
  select.dispatchEvent(new Event("change", { bubbles: true }))
}

function pageLoaded() {
  scan()
  // Let every astro:page-load subscriber reinstall its source-inspector capture listeners first.
  queueMicrotask(activateQueryTarget)
}

export function catalogSourceInspectorsReady(): void {
  // The source controls can accept replayed framework changes immediately;
  // native deep links need not wait for unrelated page assets to finish loading.
  documentReady = true
  initializeCatalogPlatformPreviews()
}

export function initializeCatalogPlatformPreviews(): void {
  if (!initialized) {
    initialized = true
    document.addEventListener("sourceframeworkchange", (event) => {
      const target = event.target
      const framework = (event as CustomEvent<{ framework?: string }>).detail?.framework
      if (!(target instanceof Element) || !framework) return
      const inspector = target.closest<HTMLElement>("[data-source-inspector]")
      if (!inspector) return
      scan()
      for (const state of states.values()) {
        if (state.inspector === inspector) selectFramework(state, framework)
      }
    })
    window.addEventListener("hashchange", () => {
      activatedLocation = undefined
      scan()
      queueMicrotask(activateQueryTarget)
    })
    document.addEventListener("astro:before-swap", teardown)
    document.addEventListener("astro:page-load", pageLoaded)
    const ready = () => {
      if (documentReady) return
      documentReady = true
      pageLoaded()
    }
    document.addEventListener("DOMContentLoaded", ready, { once: true })
    // Also cover a late module evaluation after DOMContentLoaded but before window.load.
    window.addEventListener("load", ready, { once: true })
  }
  pageLoaded()
}
