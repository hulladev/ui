let cleanup: (() => void) | undefined
let inspectorModule: Promise<typeof import("./source-inspector")> | undefined
const loadInspector = () => (inspectorModule ??= import("./source-inspector"))

export function observeSourceInspectors() {
  cleanup?.()
  const inspectors = Array.from(document.querySelectorAll<HTMLElement>("[data-source-inspector]"))
  const nearby = new Set<HTMLElement>()
  const lifecycle = new AbortController()
  let target: HTMLElement | undefined
  let timer: number | undefined
  let running = false

  const pending = (inspector: HTMLElement) => inspector.dataset.sourceInspectorReady !== "true"
  const distance = (inspector: HTMLElement) => {
    const bounds = inspector.getBoundingClientRect()
    return Math.max(0, bounds.top - window.innerHeight, -bounds.bottom)
  }
  const schedule = () => {
    if (timer !== undefined || running || lifecycle.signal.aborted) return
    // Yield between inspectors so scrolling and navigation can paint and reprioritize work.
    timer = window.setTimeout(() => void run(), 32)
  }
  const run = async () => {
    timer = undefined
    running = true
    try {
      const module = await loadInspector()
      if (lifecycle.signal.aborted) return
      // Re-evaluate after the import: a navigation may have changed the target meanwhile.
      const next =
        target && pending(target)
          ? target
          : [...nearby].filter(pending).sort((a, b) => distance(a) - distance(b))[0]
      if (next) module.initializeSourceInspector(next)
    } catch {
      // Keep the server-rendered plain source usable if the optional chunk fails.
      inspectorModule = undefined
      nearby.clear()
      target = undefined
    } finally {
      running = false
      if ((target && pending(target)) || [...nearby].some(pending)) schedule()
    }
  }
  const prioritizeHash = () => {
    let id: string
    try {
      id = decodeURIComponent(window.location.hash.slice(1))
    } catch {
      return
    }
    target =
      document.getElementById(id)?.querySelector<HTMLElement>("[data-source-inspector]") ??
      undefined
    if (target && pending(target)) schedule()
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const inspector = entry.target as HTMLElement
        if (entry.isIntersecting) nearby.add(inspector)
        else nearby.delete(inspector)
      }
      if ([...nearby].some(pending)) schedule()
    },
    { rootMargin: "400px 0px" }
  )
  inspectors.forEach((inspector) => observer.observe(inspector))

  // Controls must also work when reached before the background initialization finishes.
  const onInteraction = async (event: Event) => {
    const inspector = (event.target as Element)?.closest<HTMLElement>("[data-source-inspector]")
    if (!inspector || !pending(inspector)) return
    const control = event.target as HTMLElement
    if (
      (event.type === "click" && !control.closest("button")) ||
      (event instanceof KeyboardEvent &&
        (!control.closest('[role="tab"]') ||
          !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)))
    ) {
      target = inspector
      schedule()
      return
    }
    const selectedValue = control instanceof HTMLSelectElement ? control.value : undefined
    event.stopImmediatePropagation()
    event.preventDefault()
    target = inspector
    try {
      const module = await loadInspector()
      if (lifecycle.signal.aborted) return
      module.initializeSourceInspector(inspector)
      if (control instanceof HTMLSelectElement && selectedValue !== undefined)
        control.value = selectedValue
      control.dispatchEvent(
        event instanceof KeyboardEvent
          ? new KeyboardEvent(event.type, event)
          : new Event(event.type, { bubbles: true, cancelable: true })
      )
    } catch {
      inspectorModule = undefined
    }
  }
  for (const type of ["click", "change", "keydown"]) {
    document.addEventListener(type, onInteraction, { capture: true, signal: lifecycle.signal })
  }
  window.addEventListener("hashchange", prioritizeHash, { signal: lifecycle.signal })
  prioritizeHash()
  cleanup = () => {
    lifecycle.abort()
    observer.disconnect()
    window.clearTimeout(timer)
  }
  document.addEventListener("astro:before-swap", cleanup, { once: true, signal: lifecycle.signal })
}
