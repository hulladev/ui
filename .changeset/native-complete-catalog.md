---
"@hulla/ui": patch
---

Expand the native registry to 48 component families, including selection, date/time
entry, content, navigation, feedback, modal surfaces, discoverable help, attachment
composition, and native swipe/keyboard patterns. Keep state and native accessibility
relationships explicit and inherit theme configuration from the existing provider.

Add isolated source-backed Expo/browser examples for every family, native platform
availability notes, and interaction/accessibility checks across browser engines,
themes, and viewport sizes. Keep document picking in the host app rather than adding
an Expo dependency to installed component sources.
