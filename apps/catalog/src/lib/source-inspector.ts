import { css } from "@tanstack/highlight/languages/css"
import { html } from "@tanstack/highlight/languages/html"
import { ts } from "@tanstack/highlight/languages/ts"
import { tsx } from "@tanstack/highlight/languages/tsx"
import { createTanStackCodeHighlighter } from "@/ui/code-highlighter-tanstack/code-highlighter-tanstack"
import { astro } from "../lib/tanstack-astro"

type SourceMode = "visible" | "minimal" | "generated"
type SourceRecord = {
  code: string
  filename: string
  framework: string
  language: "astro" | "css" | "ts" | "tsx"
  mode: SourceMode
}

const highlighter = createTanStackCodeHighlighter({
  fallbackLanguage: "ts",
  languages: [astro, css, html, ts, tsx],
})

const statusFor = (record: SourceRecord) => {
  if (record.mode === "visible") return "Exact render"
  if (record.mode === "minimal") return "Copy-ready"
  return "Generated source"
}

const renderHighlightedSource = (output: HTMLElement, record: SourceRecord) => {
  const highlighted = highlighter.highlight(record.code, { language: record.language })
  const pre = output.querySelector<HTMLElement>('[data-slot="code-block-content"]')!
  const code = pre.querySelector<HTMLElement>('[data-slot="code-block-code"]')!
  const lineTemplate = code.querySelector<HTMLElement>("[data-code-line]")!
  const fragment = document.createDocumentFragment()
  pre.dataset.language = highlighted.language
  highlighted.lines.forEach((line, index) => {
    const lineElement = lineTemplate.cloneNode(false) as HTMLElement
    lineElement.dataset.line = String(index + 1)
    line.tokens.forEach((token) => {
      const tokenElement = document.createElement("span")
      if (token.className) tokenElement.className = token.className
      tokenElement.textContent = token.content
      lineElement.append(tokenElement)
    })
    fragment.append(lineElement)
    if (index < highlighted.lines.length - 1) fragment.append("\n")
  })
  code.replaceChildren(fragment)
}

export const initializeSourceInspector = (inspector: HTMLElement) => {
  if (inspector.dataset.sourceInspectorReady === "true") return

  const tabs = Array.from(inspector.querySelectorAll<HTMLButtonElement>("[data-source-tab]"))
  const frameworkSelect = inspector.querySelector<HTMLSelectElement>(
    "[data-source-framework-select]"
  )
  const modeTabs = Array.from(inspector.querySelectorAll<HTMLButtonElement>("[data-source-mode]"))
  const tabGroups = Array.from(inspector.querySelectorAll<HTMLElement>("[data-source-files]"))
  const records = Array.from(
    inspector.querySelectorAll<HTMLTemplateElement>("[data-source-record]")
  ).map(
    (template): SourceRecord => ({
      code: template.content.textContent ?? "",
      filename: template.dataset.filename ?? "generated/source.ts",
      framework: template.dataset.framework ?? "Source",
      language:
        template.dataset.language === "tsx"
          ? "tsx"
          : template.dataset.language === "ts"
            ? "ts"
            : template.dataset.language === "css"
              ? "css"
              : "astro",
      mode:
        template.dataset.mode === "visible" || template.dataset.mode === "minimal"
          ? template.dataset.mode
          : "generated",
    })
  )
  const output = inspector.querySelector<HTMLElement>("[data-source-output]")
  const path = inspector.querySelector<HTMLElement>("[data-source-path]")
  const diagnostics = inspector.querySelector<HTMLElement>("[data-diagnostics]")
  const copyButton = inspector.querySelector<HTMLButtonElement>("[data-copy-source]")
  const copyLabel = inspector.querySelector<HTMLElement>("[data-copy-label]")
  if (!output || records.length === 0) return

  inspector.dataset.sourceInspectorReady = "true"
  const lifecycle = new AbortController()
  let activeIndex = Number(
    inspector.querySelector<HTMLButtonElement>('[data-source-tab][aria-selected="true"]')?.dataset
      .sourceIndex ?? 0
  )

  const cachedSources = new Map<number, Node[]>()

  const selectSource = (index: number, moveFocus = false) => {
    const record = records[index]
    if (!record) return
    activeIndex = index

    tabs.forEach((tab) => {
      const selected = Number(tab.dataset.sourceIndex) === index
      tab.setAttribute("aria-selected", String(selected))
      tab.tabIndex = selected ? 0 : -1
      if (selected && moveFocus) tab.focus()
    })
    modeTabs.forEach((tab) => {
      const selected = tab.dataset.sourceMode === record.mode
      tab.setAttribute("aria-selected", String(selected))
      tab.tabIndex = selected ? 0 : -1
    })
    if (frameworkSelect) frameworkSelect.value = record.framework
    tabGroups.forEach((group) => {
      group.hidden = group.dataset.sourceFiles !== `${record.framework}:${record.mode}`
    })

    const code = output.querySelector<HTMLElement>('[data-slot="code-block-code"]')!
    const cached = cachedSources.get(index)
    if (cached) {
      code.replaceChildren(...cached.map((node) => node.cloneNode(true)))
    } else {
      renderHighlightedSource(output, record)
      cachedSources.set(
        index,
        Array.from(code.childNodes, (node) => node.cloneNode(true))
      )
    }
    output.querySelector<HTMLElement>("pre")!.dataset.language = record.language
    if (path) path.textContent = record.filename
    if (diagnostics) {
      diagnostics.textContent = statusFor(record)
      diagnostics.dataset.state = "ready"
    }
  }

  tabs.forEach((tab) => {
    const index = Number(tab.dataset.sourceIndex)
    tab.addEventListener("click", () => selectSource(index), { signal: lifecycle.signal })
    tab.addEventListener(
      "keydown",
      (event) => {
        const groupTabs = Array.from(
          tab
            .closest("[data-source-files]")
            ?.querySelectorAll<HTMLButtonElement>("[data-source-tab]") ?? []
        )
        const currentPosition = groupTabs.indexOf(tab)
        let nextPosition = currentPosition
        if (event.key === "ArrowRight") nextPosition = (currentPosition + 1) % groupTabs.length
        if (event.key === "ArrowLeft") {
          nextPosition = (currentPosition - 1 + groupTabs.length) % groupTabs.length
        }
        if (event.key === "Home") nextPosition = 0
        if (event.key === "End") nextPosition = groupTabs.length - 1
        if (nextPosition === currentPosition) return
        event.preventDefault()
        selectSource(Number(groupTabs[nextPosition]?.dataset.sourceIndex), true)
      },
      { signal: lifecycle.signal }
    )
  })

  modeTabs.forEach((tab, index) => {
    tab.addEventListener(
      "click",
      () => {
        const activeFramework = records[activeIndex]?.framework
        let recordIndex = records.findIndex(
          ({ framework, mode }) => framework === activeFramework && mode === tab.dataset.sourceMode
        )
        if (recordIndex < 0) {
          recordIndex = records.findIndex(({ mode }) => mode === tab.dataset.sourceMode)
        }
        selectSource(recordIndex)
      },
      { signal: lifecycle.signal }
    )
    tab.addEventListener(
      "keydown",
      (event) => {
        let nextIndex = index
        if (event.key === "ArrowRight") nextIndex = (index + 1) % modeTabs.length
        if (event.key === "ArrowLeft") {
          nextIndex = (index - 1 + modeTabs.length) % modeTabs.length
        }
        if (event.key === "Home") nextIndex = 0
        if (event.key === "End") nextIndex = modeTabs.length - 1
        if (nextIndex === index) return
        event.preventDefault()
        modeTabs[nextIndex]?.click()
        modeTabs[nextIndex]?.focus()
      },
      { signal: lifecycle.signal }
    )
  })

  frameworkSelect?.addEventListener(
    "change",
    () => {
      const activeMode = records[activeIndex]?.mode
      let recordIndex = records.findIndex(
        ({ framework, mode }) => framework === frameworkSelect.value && mode === activeMode
      )
      if (recordIndex < 0) {
        recordIndex = records.findIndex(({ framework }) => framework === frameworkSelect.value)
      }
      selectSource(recordIndex)
    },
    { signal: lifecycle.signal }
  )

  copyButton?.addEventListener(
    "click",
    async () => {
      const source = records[activeIndex]?.code
      if (!source || !copyLabel) return
      try {
        await navigator.clipboard.writeText(source)
        copyLabel.textContent = "Copied"
        window.setTimeout(() => {
          copyLabel.textContent = "Copy"
        }, 1600)
      } catch {
        copyLabel.textContent = "Copy failed"
      }
    },
    { signal: lifecycle.signal }
  )
  selectSource(activeIndex)
}
