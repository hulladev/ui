import accordionCatalogSource from "../components/catalog/AccordionCatalog.astro?raw"
import alertCatalogSource from "../components/catalog/AlertCatalog.astro?raw"
import avatarCatalogSource from "../components/catalog/AvatarCatalog.astro?raw"
import badgeCatalogSource from "../components/catalog/BadgeCatalog.astro?raw"
import breadcrumbsCatalogSource from "../components/catalog/BreadcrumbsCatalog.astro?raw"
import buttonCatalogSource from "../components/catalog/ButtonCatalog.astro?raw"
import cardCatalogSource from "../components/catalog/CardCatalog.astro?raw"
import checkboxCatalogSource from "../components/catalog/CheckboxCatalog.astro?raw"
import dialogCatalogSource from "../components/catalog/DialogCatalog.astro?raw"
import dropdownMenuCatalogSource from "../components/catalog/DropdownMenuCatalog.astro?raw"
import floatingCatalogSource from "../components/catalog/FloatingCatalog.astro?raw"
import inputFieldCatalogSource from "../components/catalog/InputFieldCatalog.astro?raw"
import kbdCatalogSource from "../components/catalog/KbdCatalog.astro?raw"
import popoverCatalogSource from "../components/catalog/PopoverCatalog.astro?raw"
import selectCatalogSource from "../components/catalog/SelectCatalog.astro?raw"
import separatorCatalogSource from "../components/catalog/SeparatorCatalog.astro?raw"
import skeletonCatalogSource from "../components/catalog/SkeletonCatalog.astro?raw"
import switchCatalogSource from "../components/catalog/SwitchCatalog.astro?raw"
import tableCatalogSource from "../components/catalog/TableCatalog.astro?raw"
import catalogStylesSource from "../styles/catalog.css?raw"

type PreviewSource = {
  code: string
  filename: string
  framework: string
  label?: string
  language: "astro" | "css" | "tsx"
}

const exactCatalogPreview = (catalogFilename: string, catalogSource: string): PreviewSource[] => [
  {
    code: catalogSource,
    filename: `apps/catalog/src/components/catalog/${catalogFilename}`,
    framework: "Astro",
    label: "Rendered source",
    language: "astro",
  },
  {
    code: catalogStylesSource,
    filename: "apps/catalog/src/styles/catalog.css",
    framework: "Astro",
    label: "Rendered styles",
    language: "css",
  },
]

export const buttonPreviewSources = exactCatalogPreview("ButtonCatalog.astro", buttonCatalogSource)

export const avatarPreviewSources = exactCatalogPreview("AvatarCatalog.astro", avatarCatalogSource)

export const badgePreviewSources = exactCatalogPreview("BadgeCatalog.astro", badgeCatalogSource)

export const breadcrumbsPreviewSources = exactCatalogPreview(
  "BreadcrumbsCatalog.astro",
  breadcrumbsCatalogSource
)

export const kbdPreviewSources = exactCatalogPreview("KbdCatalog.astro", kbdCatalogSource)

export const skeletonPreviewSources = exactCatalogPreview(
  "SkeletonCatalog.astro",
  skeletonCatalogSource
)

export const separatorPreviewSources = exactCatalogPreview(
  "SeparatorCatalog.astro",
  separatorCatalogSource
)

export const inputPreviewSources = exactCatalogPreview(
  "InputFieldCatalog.astro",
  inputFieldCatalogSource
)

export const switchPreviewSources = exactCatalogPreview("SwitchCatalog.astro", switchCatalogSource)

export const checkboxPreviewSources = exactCatalogPreview(
  "CheckboxCatalog.astro",
  checkboxCatalogSource
)

export const selectPreviewSources = exactCatalogPreview("SelectCatalog.astro", selectCatalogSource)

export const popoverPreviewSources = exactCatalogPreview(
  "PopoverCatalog.astro",
  popoverCatalogSource
)

export const floatingPreviewSources = exactCatalogPreview(
  "FloatingCatalog.astro",
  floatingCatalogSource
)

export const dropdownMenuPreviewSources = exactCatalogPreview(
  "DropdownMenuCatalog.astro",
  dropdownMenuCatalogSource
)

export const dialogPreviewSources = exactCatalogPreview("DialogCatalog.astro", dialogCatalogSource)

export const cardPreviewSources = exactCatalogPreview("CardCatalog.astro", cardCatalogSource)

export const tablePreviewSources = exactCatalogPreview("TableCatalog.astro", tableCatalogSource)

export const alertPreviewSources = exactCatalogPreview("AlertCatalog.astro", alertCatalogSource)

export const accordionPreviewSources = exactCatalogPreview(
  "AccordionCatalog.astro",
  accordionCatalogSource
)
