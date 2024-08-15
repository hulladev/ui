import type { Line } from './types'

export async function createChanges(oldContent: string, newContent: string): Promise<Line[]> {
  const oldLines = oldContent.split('\n')
  const newLines = newContent.split('\n')

  const changes: Line[] = []

  let oldIndex = 0
  let newIndex = 0

  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    if (oldIndex < oldLines.length && newIndex < newLines.length && oldLines[oldIndex] === newLines[newIndex]) {
      changes.push({
        content: oldLines[oldIndex],
        index: oldIndex + 1,
        status: 'unchanged',
      })
      oldIndex++
      newIndex++
    } else {
      // Check for removed lines
      while (oldIndex < oldLines.length && oldLines[oldIndex] !== newLines[newIndex]) {
        changes.push({
          content: oldLines[oldIndex],
          index: oldIndex + 1,
          status: 'removed',
        })
        oldIndex++
      }

      // Check for added lines
      while (newIndex < newLines.length && oldLines[oldIndex] !== newLines[newIndex]) {
        changes.push({
          content: newLines[newIndex],
          index: newIndex + 1,
          status: 'added',
        })
        newIndex++
      }
    }
  }

  return changes
}
