import alertCatalogSource from "../components/catalog/AlertCatalog.astro?raw"
import badgeCatalogSource from "../components/catalog/BadgeCatalog.astro?raw"
import buttonCatalogSource from "../components/catalog/ButtonCatalog.astro?raw"
import cardCatalogSource from "../components/catalog/CardCatalog.astro?raw"
import dialogCatalogSource from "../components/catalog/DialogCatalog.astro?raw"
import dropdownMenuCatalogSource from "../components/catalog/DropdownMenuCatalog.astro?raw"
import inputFieldCatalogSource from "../components/catalog/InputFieldCatalog.astro?raw"
import kbdCatalogSource from "../components/catalog/KbdCatalog.astro?raw"
import popoverCatalogSource from "../components/catalog/PopoverCatalog.astro?raw"
import selectCatalogSource from "../components/catalog/SelectCatalog.astro?raw"
import catalogStylesSource from "../styles/catalog.css?raw"

type PreviewSource = {
  code: string
  filename: string
  framework: string
  label?: string
  language: "astro" | "css" | "tsx"
}

const catalogPreview = (
  filename: string,
  catalogFilename: string,
  catalogSource: string,
  reactEquivalent: string
): PreviewSource[] => [
  {
    code: catalogSource,
    filename: `apps/catalog/src/components/catalog/${catalogFilename}`,
    framework: "Astro",
    label: "Catalog demo",
    language: "astro",
  },
  {
    code: catalogStylesSource,
    filename: "apps/catalog/src/styles/catalog.css",
    framework: "Astro",
    label: "Catalog styles",
    language: "css",
  },
  {
    code: reactEquivalent,
    filename: `src/components/${filename}.tsx`,
    framework: "React",
    label: "Catalog demo",
    language: "tsx",
  },
]

export const buttonPreviewSources = catalogPreview(
  "button-preview",
  "ButtonCatalog.astro",
  buttonCatalogSource,
  `import { Button } from "@/ui/button"

const variants = ["primary", "secondary", "outline"] as const
const sizes = ["sm", "md", "lg"] as const

export function ButtonPreview() {
  return (
    <div className="grid gap-5">
      {variants.map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <span className="w-20 text-xs uppercase">{variant}</span>
          {sizes.map((size) => (
            <Button key={size} variant={variant} size={size}>
              {size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}
            </Button>
          ))}
        </div>
      ))}
      <Button disabled>Unavailable</Button>
    </div>
  )
}`
)

export const badgePreviewSources = catalogPreview(
  "badge-preview",
  "BadgeCatalog.astro",
  badgeCatalogSource,
  `import { Badge } from "@/ui/badge"

const variants = [
  ["neutral", "Draft"],
  ["primary", "Pro"],
  ["success", "Operational"],
  ["warning", "Needs review"],
  ["danger", "Failed"],
] as const
const sizes = ["sm", "md", "lg"] as const

export function BadgePreview() {
  return (
    <div className="grid gap-3">
      {variants.map(([variant, label]) => (
        <div key={variant} className="grid grid-cols-4 items-center gap-2">
          <span>{variant}</span>
          {sizes.map((size) => (
            <Badge key={size} variant={variant} size={size}>
              {label}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  )
}`
)

export const kbdPreviewSources = catalogPreview(
  "kbd-preview",
  "KbdCatalog.astro",
  kbdCatalogSource,
  `import { Kbd } from "@/ui/kbd"

const shortcuts = [
  ["Open command menu", ["⌘", "K"]],
  ["Quick switch project", ["⌘", "P"]],
  ["Close current view", ["Esc"]],
] as const

export function KbdPreview() {
  return (
    <div className="grid gap-4">
      <section>
        <strong>Command menu</strong>
        <p>
          Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> from anywhere.
        </p>
      </section>

      <div>
        {shortcuts.map(([action, keys]) => (
          <div key={action} className="flex justify-between">
            <span>{action}</span>
            <span>{keys.map((key) => <Kbd key={key}>{key}</Kbd>)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}`
)

export const inputPreviewSources = catalogPreview(
  "input-field-preview",
  "InputFieldCatalog.astro",
  inputFieldCatalogSource,
  `import { Field, FieldDescription, FieldError, FieldLabel } from "@/ui/field"
import { Input } from "@/ui/input"

const variants = ["outline", "filled", "underline"] as const
const sizes = ["sm", "md", "lg"] as const

export function InputFieldPreview() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-3 gap-3">
        {variants.map((variant) => (
          <Field key={variant}>
            <FieldLabel htmlFor={\`input-\${variant}\`}>{variant}</FieldLabel>
            <Input id={\`input-\${variant}\`} variant={variant} placeholder="Workspace name" />
          </Field>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {sizes.map((controlSize) => (
          <Field key={controlSize}>
            <FieldLabel htmlFor={\`input-\${controlSize}\`}>{controlSize}</FieldLabel>
            <Input id={\`input-\${controlSize}\`} controlSize={controlSize} placeholder="Input" />
          </Field>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="project-code">Project code</FieldLabel>
          <Input id="project-code" required placeholder="e.g. ORB-142" />
          <FieldDescription>Used in generated issue keys.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-email">Contact email</FieldLabel>
          <Input id="contact-email" value="not-an-email" aria-invalid="true" />
          <FieldError>Enter a valid work email.</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="input-date">Date</FieldLabel>
          <Input id="input-date" type="date" defaultValue="2026-07-25" />
        </Field>
        <Field>
          <FieldLabel htmlFor="attachments">Attachments</FieldLabel>
          <Input id="attachments" type="file" multiple />
        </Field>
      </div>
    </div>
  )
}`
)

export const selectPreviewSources = catalogPreview(
  "select-preview",
  "SelectCatalog.astro",
  selectCatalogSource,
  `import { Field, FieldDescription, FieldError, FieldLabel } from "@/ui/field"
import { Select } from "@/ui/select"

const variants = ["outline", "filled", "underline"] as const
const sizes = ["sm", "md", "lg"] as const

export function SelectPreview() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-3 gap-3">
        {variants.map((variant) => (
          <Field key={variant}>
            <FieldLabel htmlFor={\`team-\${variant}\`}>{variant}</FieldLabel>
            <Select id={\`team-\${variant}\`} variant={variant} defaultValue="engineering">
              <option value="design">Design</option>
              <option value="engineering">Engineering</option>
              <option value="operations">Operations</option>
            </Select>
          </Field>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {sizes.map((controlSize) => (
          <Field key={controlSize}>
            <FieldLabel htmlFor={\`office-\${controlSize}\`}>{controlSize}</FieldLabel>
            <Select id={\`office-\${controlSize}\`} controlSize={controlSize}>
              <option>Prague</option>
              <option>London</option>
              <option>Tokyo</option>
            </Select>
          </Field>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="owner">Owner</FieldLabel>
          <Select id="owner" required aria-invalid="true" defaultValue="">
            <option value="" disabled>Choose an owner</option>
            <option value="alex">Alex Morgan</option>
          </Select>
          <FieldError>Select an owner to continue.</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="regions">Regions</FieldLabel>
          <Select id="regions" multiple size={3}>
            <option>Europe</option>
            <option>North America</option>
            <option>Asia Pacific</option>
          </Select>
          <FieldDescription>Native multiple selection.</FieldDescription>
        </Field>
      </div>
    </div>
  )
}`
)

export const popoverPreviewSources = catalogPreview(
  "popover-preview",
  "PopoverCatalog.astro",
  popoverCatalogSource,
  `import { Button } from "@/ui/button"
import { Popover } from "@/ui/popover"

export function PopoverPreview() {
  return (
    <>
      <Button
        variant="outline"
        popoverTarget="account-actions"
        aria-label="Open account actions"
      >
        <span aria-hidden="true">SH</span>
        Account
        <span aria-hidden="true">⌄</span>
      </Button>

      <Popover
        id="account-actions"
        placement="bottom-end"
        aria-label="Account actions"
        className="w-64"
      >
        <div className="p-3">
          <strong>Samuel Hulla</strong>
          <small>samuel@hulla.dev</small>
        </div>
        <a href="/profile">View profile</a>
        <a href="/settings">Workspace settings</a>
        <button popoverTarget="account-actions" popoverTargetAction="hide">
          Sign out
        </button>
      </Popover>
    </>
  )
}`
)

export const dropdownMenuPreviewSources = catalogPreview(
  "dropdown-menu-preview",
  "DropdownMenuCatalog.astro",
  dropdownMenuCatalogSource,
  `import { useId } from "react"
import { Button } from "@/ui/button"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/ui/dropdown-menu"
import { Kbd } from "@/ui/kbd"

export function DropdownMenuPreview() {
  const menuId = useId()

  return (
    <>
      <div className="flex items-center gap-3">
        <span aria-hidden="true">OR</span>
        <span>
          <strong>Orbital release</strong>
          <small>Engineering / Active</small>
        </span>
        <Button
          size="sm"
          variant="outline"
          popoverTarget={menuId}
          aria-haspopup="menu"
          aria-label="Open project actions"
        >
          •••
        </Button>
      </div>

      <DropdownMenu id={menuId} placement="bottom-end" aria-label="Project actions">
        <DropdownMenuGroup aria-labelledby={\`\${menuId}-project\`}>
          <DropdownMenuLabel id={\`\${menuId}-project\`}>
            Project
          </DropdownMenuLabel>
          <DropdownMenuItem>Rename project <Kbd>↵</Kbd></DropdownMenuItem>
          <DropdownMenuItem>Duplicate <Kbd>⌘D</Kbd></DropdownMenuItem>
          <DropdownMenuItem>Move to workspace</DropdownMenuItem>
          <DropdownMenuItem disabled>Archive current release</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup aria-labelledby={\`\${menuId}-danger\`}>
          <DropdownMenuLabel id={\`\${menuId}-danger\`}>
            Danger zone
          </DropdownMenuLabel>
          <DropdownMenuItem variant="danger">
            Delete project <Kbd>⌘⌫</Kbd>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenu>
    </>
  )
}`
)

export const dialogPreviewSources = catalogPreview(
  "dialog-preview",
  "DialogCatalog.astro",
  dialogCatalogSource,
  `import { useState } from "react"
import { Button } from "@/ui/button"
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog"

const variants = ["compact", "workspace", "fullscreen"] as const

export function DialogPreview() {
  const [openVariant, setOpenVariant] =
    useState<(typeof variants)[number] | null>(null)

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {variants.map((variant) => (
          <section key={variant}>
            <span>{variant}</span>
            <strong>
              {variant === "compact"
                ? "Focused decisions"
                : variant === "workspace"
                  ? "Layered tools"
                  : "Immersive work"}
            </strong>
            <Button onClick={() => setOpenVariant(variant)}>
              Open {variant}
            </Button>
          </section>
        ))}
      </div>

      {openVariant && (
        <Dialog
          variant={openVariant}
          aria-labelledby="preview-dialog-title"
          aria-describedby="preview-dialog-description"
          onDismiss={() => setOpenVariant(null)}
        >
          <DialogHeader>
            <DialogTitle id="preview-dialog-title">Review release</DialogTitle>
            <DialogDescription id="preview-dialog-description">
              Confirm the release details before continuing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenVariant(null)}>Cancel</Button>
            <Button onClick={() => setOpenVariant(null)}>Continue</Button>
          </DialogFooter>
        </Dialog>
      )}
    </>
  )
}`
)

export const cardPreviewSources = catalogPreview(
  "card-preview",
  "CardCatalog.astro",
  cardCatalogSource,
  `import { Button } from "@/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card"

export function CardPreview() {
  return (
    <div className="grid gap-4">
      <Card variant="elevated" aria-labelledby="release-title">
        <CardHeader>
          <div className="mb-1 flex items-center justify-between gap-4 font-mono text-xs tracking-wider text-muted-foreground uppercase">
            <span>Elevated / Release 024</span>
            <span className="flex items-center gap-1.5 text-foreground">
              <i className="size-2 rounded-full bg-success" />Ready
            </span>
          </div>
          <CardTitle id="release-title">Candidate approved for production.</CardTitle>
          <CardDescription>
            The release train is clear. All required checks completed seven minutes ago.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-5">
            <div className="grid grid-cols-3 overflow-hidden rounded-md border border-border bg-surface-raised/70">
              <span className="grid gap-0.5 border-l border-border px-4 py-3 first:border-l-0">
                <strong className="text-lg">18</strong><small>checks passed</small>
              </span>
              <span className="grid gap-0.5 border-l border-border px-4 py-3">
                <strong className="text-lg">0</strong><small>open blockers</small>
              </span>
              <span className="grid gap-0.5 border-l border-border px-4 py-3">
                <strong className="text-lg">4m</strong><small>build time</small>
              </span>
            </div>
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3" aria-label="Release readiness: 100%">
              <span>Readiness</span>
              <span className="h-1 overflow-hidden rounded-full bg-foreground/10" aria-hidden="true">
                <i className="block h-full w-full bg-primary" />
              </span>
              <strong className="font-mono text-xs">100%</strong>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button size="sm">Review release</Button>
          <Button size="sm" variant="outline">View checks</Button>
          <span className="ml-auto font-mono text-xs text-muted-foreground">Updated 7m ago</span>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] gap-4">
        <Card variant="outline" aria-labelledby="velocity-title">
          <CardHeader>
            <span>Outline / Cycle velocity</span>
            <CardTitle id="velocity-title">4.2 days</CardTitle>
            <CardDescription>Median time to production</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-14 items-end gap-1" aria-label="Velocity improved 16 percent">
              {[46, 58, 52, 68, 63, 82].map((point) => (
                <span
                  className="w-1.5 rounded-t-full bg-primary"
                  key={point}
                  style={{ height: \`\${point}%\` }}
                />
              ))}
              <strong className="ml-auto self-end font-mono text-xs text-success">−16%</strong>
            </div>
          </CardContent>
        </Card>

        <Card variant="ghost" aria-labelledby="note-title">
          <CardHeader>
            <span className="font-mono text-xs text-primary">Ghost / 01</span>
            <CardTitle id="note-title">Native by default.</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Every part accepts native attributes. Classes merge last, so a card can become a
              metric, notice, or full workflow surface without another prop.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}`
)

export const alertPreviewSources = catalogPreview(
  "alert-preview",
  "AlertCatalog.astro",
  alertCatalogSource,
  `import { Alert } from "@/ui/alert"

const alerts = [
  ["note", "Note", "Additional context that helps explain the surrounding content."],
  ["success", "Success", "Release checks passed. This version is ready for production."],
  ["important", "Important", "This migration changes the public import path."],
  ["warning", "Warning", "The current token will expire in 24 hours."],
  ["danger", "Danger", "This action removes production data and cannot be undone."],
] as const

export function AlertPreview() {
  return (
    <div className="grid gap-3">
      {alerts.map(([variant, title, body]) => (
        <Alert key={variant} variant={variant}>
          <strong>{title}</strong>
          <p>{body}</p>
        </Alert>
      ))}
    </div>
  )
}`
)
