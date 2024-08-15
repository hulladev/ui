export type Status = 'added' | 'removed' | 'unchanged'

export type Line = {
  content: string
  index: number
  status: Status
}

export type Codemod = {
  name: string
  description: string
  path: string
  run: () => Promise<void>
  lines: Line[]
  hasChanges: boolean
}
