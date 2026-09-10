# Default-theme color usage

Component colors come from the semantic palette in `packages/components/src/styles.css`.
Use these roles when composing components; do not introduce local hue shifts or raw palette colors.

- `background`, `surface`, and `surface-raised` establish page and surface depth.
- `foreground`, `muted-foreground`, and `border` establish neutral hierarchy.
- `primary` is the accent fill and selection marker. Pair solid primary fills with
  `primary-foreground`. Use `primary-text` for accent labels and icons on neutral or lightly tinted
  surfaces: it uses the primary hue with enough lightness for dark-mode reading.
- `success`, `warning`, and `danger` communicate semantic state. Their hue comes from the same
  token in badges, alerts, toasts, validation, menus, and controls.
- `on-emphasis` is light text for dark semantic fills. It is not a universal text color for every
  status: the light warning fill requires `foreground` text.
- `focus-ring` remains the consistent keyboard-focus indicator. Validation controls may use danger
  when their focus treatment also communicates an invalid value.

## Filled and tonal treatments

Light-mode semantic badges use solid fills. Dark-mode badges use a 15% semantic fill and the
semantic color for text. The danger button follows this same dark-mode pairing, with a subtle
semantic border to identify its interactive boundary. Destructive menu items use the same 15%
fill when highlighted in dark mode.

Alerts and toasts contain longer text, so they keep neutral text on surfaces with restrained
semantic tinting. Progress, meter, checkbox, radio, and slider indicators may use solid colors
because they communicate a value or selection. These differences follow component roles rather
than introducing separate palettes. Code syntax colors remain a separate, purpose-specific palette.

## Button interaction

Use a visible color step with the existing 150ms transition. Solid primary buttons darken on
hover and press to preserve light-label contrast. Inverted buttons soften their foreground fill;
secondary and outline buttons gain neutral fill; dark danger buttons step from 15% to 22% and
25% semantic fill. Hover and pressed styles apply only to enabled buttons. Disabled buttons share
the same neutral treatment across variants. Avoid extra motion, glow, or stacked focus effects.

Check compositions in both themes and at narrow widths. Verify normal text contrast at 4.5:1 or
better, including hover and pressed states, and preserve consumer class/style overrides.

## Shared interaction hierarchy

`hover-surface` is the neutral pointer/keyboard-highlight fill for rows and transient choices.
`selected-surface` and `selected-hover-surface` are persistent accent selection fills. Selection
also retains a checkmark, tab indicator, pressed underline, or current-page marker; hover must not
replace that state. Command-menu highlighting is transient active-descendant navigation, so it uses
hover rather than persistent-selection paint. Destructive menu items retain the danger palette.

`disabled-foreground`, `disabled-surface`, and `disabled-border` keep unavailable controls visible
without fading their whole subtree. Field wrappers no longer reduce opacity on top of their controls.
Text fields keep their value readable; rows use subdued text without adding an artificial button
surface. Checkboxes, radios, switches, and standalone toggles retain neutral value indicators.
Slider thumbs retain position and use a neutral fill, with hover enlargement disabled.

Filled fields need a stronger hover step than transparent rows because their resting fill is already
visible. Input focus and validation take precedence over hover; groups own the single field boundary.
Native summaries keep disclosure affordances. Calendar dates retain their unavailable-date treatment,
and workflow steps keep progress context. Toggle groups retain their existing eligibility rules
(which remove disabled choices from the group's value); this styling pass does not change behavior.

Keyboard focus stays distinct from hover and selection. Native controls use the existing focus-ring
outline; text fields use their established focus boundary and soft ring; custom listboxes use their
active-descendant highlight. Do not add an extra outline to an already focus-styled field group.
