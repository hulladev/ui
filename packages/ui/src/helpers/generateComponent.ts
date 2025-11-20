import { Dirent, existsSync } from "node:fs"
import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import {
  createSourceFile,
  forEachChild,
  isCallExpression,
  isIdentifier,
  isImportDeclaration,
  isNamedImports,
  isVariableStatement,
  Node,
  ScriptTarget,
  StringLiteral,
  SyntaxKind,
} from "typescript"
import { Frameworks } from "../types.public"
import { resolvePathAlias, resolveTsconfigPath } from "./parser"

type TransformFileParams = {
  dirent: Dirent
  framework: Frameworks[number]
  outputPath: string
  tsconfigPath?: string
}

export async function generateComponent({
  dirent,
  framework,
  outputPath,
  tsconfigPath,
}: TransformFileParams) {
  if (dirent.isDirectory()) {
    const dirOutputPath = join(outputPath, dirent.name)
    if (!existsSync(dirOutputPath)) {
      await mkdir(dirOutputPath, { recursive: true })
    }
    // Fix: read subdirectory contents and process each file
    const subDirPath = join(dirent.parentPath, dirent.name)
    const subDirContents = await readdir(subDirPath, { withFileTypes: true })
    await Promise.all(
      subDirContents.map((subDirent) =>
        generateComponent({ dirent: subDirent, framework, outputPath: dirOutputPath, tsconfigPath })
      )
    )
  } else {
    if (dirent.name === "package.json") {
      const sourcePath = join(dirent.parentPath, dirent.name)
      const destPath = join(outputPath, dirent.name)
      await copyFile(sourcePath, destPath)
    } else {
      const sourcePath = join(dirent.parentPath, dirent.name)
      const fileContents = await readFile(sourcePath, {
        encoding: "utf-8",
      })
      const transformedContent = await transformFile(
        fileContents,
        sourcePath,
        dirent.parentPath,
        tsconfigPath
      )
      const destPath = join(outputPath, dirent.name)
      await writeFile(destPath, transformedContent, "utf-8")
    }
  }
}

async function transformFile(
  fileContents: string,
  sourceFilePath: string,
  sourceFileDir: string,
  tsconfigPath?: string
): Promise<string> {
  const sourceFile = createSourceFile(sourceFilePath, fileContents, ScriptTarget.Latest, true)

  // Find tsconfig
  const resolvedTsconfigPath = await resolveTsconfigPath(sourceFileDir, tsconfigPath)

  // Track imports to remove and add
  const importsToRemove = new Set<string>()
  const importsToAdd: { moduleSpecifier: string; importClause: string }[] = []
  const variablesToInline = new Map<string, { name: string; value: string }>()

  // Find all resolve() calls
  const resolveCallArgs: string[] = []
  function findResolveCalls(node: Node) {
    if (
      isCallExpression(node) &&
      isIdentifier(node.expression) &&
      node.expression.text === "resolve" &&
      node.arguments.length === 1
    ) {
      const arg = node.arguments[0]
      if (arg && isIdentifier(arg)) {
        resolveCallArgs.push(arg.text)
      }
    }
    forEachChild(node, findResolveCalls)
  }
  findResolveCalls(sourceFile)

  // If no resolve calls, return original content
  if (resolveCallArgs.length === 0) {
    return fileContents
  }

  // Find imports for each resolve argument
  const importMap = new Map<string, { moduleSpecifier: string; importClause: string }>()
  sourceFile.statements.forEach((statement) => {
    if (isImportDeclaration(statement)) {
      const moduleSpecifier = (statement.moduleSpecifier as StringLiteral).text

      if (statement.importClause) {
        const namedBindings = statement.importClause.namedBindings
        if (namedBindings && isNamedImports(namedBindings)) {
          namedBindings.elements.forEach((element) => {
            const importedName = element.name.text
            if (resolveCallArgs.includes(importedName)) {
              importMap.set(importedName, {
                moduleSpecifier,
                importClause: fileContents.substring(statement.pos, statement.end).trim(),
              })
              importsToRemove.add(moduleSpecifier)
            }
          })
        }
      }

      // Check if this is the resolve import from @hulla/ui
      if (moduleSpecifier === "@hulla/ui") {
        importsToRemove.add("@hulla/ui")
      }
    }
  })

  // Process each variable to inline
  for (const varName of resolveCallArgs) {
    const importInfo = importMap.get(varName)
    if (!importInfo) {
      throw new Error(`Cannot find import for variable "${varName}"`)
    }

    // Resolve the import path
    const resolvedPath = resolvePathAlias(
      importInfo.moduleSpecifier,
      sourceFileDir,
      resolvedTsconfigPath
    )

    // Read the imported file
    const importedFileContents = await readFile(resolvedPath, "utf-8")
    const importedSourceFile = createSourceFile(
      resolvedPath,
      importedFileContents,
      ScriptTarget.Latest,
      true
    )

    // Find the exported declaration
    let declarationValue = ""
    let declarationImports: string[] = []

    importedSourceFile.statements.forEach((statement) => {
      if (isVariableStatement(statement)) {
        const hasExport = statement.modifiers?.some((mod) => mod.kind === SyntaxKind.ExportKeyword)
        if (hasExport) {
          statement.declarationList.declarations.forEach((declaration) => {
            if (isIdentifier(declaration.name) && declaration.name.text === varName) {
              if (declaration.initializer) {
                declarationValue = importedFileContents
                  .substring(declaration.initializer.pos, declaration.initializer.end)
                  .trim()
              }
            }
          })
        }
      }

      // Collect imports from the imported file
      if (isImportDeclaration(statement)) {
        const importText = importedFileContents.substring(statement.pos, statement.end).trim()
        declarationImports.push(importText)
      }
    })

    if (!declarationValue) {
      throw new Error(`Cannot find exported declaration for "${varName}" in ${resolvedPath}`)
    }

    variablesToInline.set(varName, { name: varName, value: declarationValue })

    // Add imports from the inlined file
    declarationImports.forEach((imp) => {
      const match = imp.match(/from\s+["']([^"']+)["']/)
      if (match && match[1]) {
        importsToAdd.push({ moduleSpecifier: match[1], importClause: imp })
      }
    })
  }

  // Generate transformed content
  let transformedContent = fileContents

  // Remove resolve import
  importsToRemove.forEach((moduleSpec) => {
    const importRegex = new RegExp(
      `import\\s+.*?from\\s+["']${moduleSpec.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][\\s]*\\n?`,
      "g"
    )
    transformedContent = transformedContent.replace(importRegex, "")
  })

  // Add new imports (after the first import or at the beginning)
  const firstImportMatch = transformedContent.match(/^(import\s+.+?\n)/m)
  if (firstImportMatch && importsToAdd.length > 0) {
    const firstImportEnd =
      transformedContent.indexOf(firstImportMatch[0]) + firstImportMatch[0].length
    const newImports = importsToAdd.map((imp) => imp.importClause).join("\n") + "\n"
    transformedContent =
      transformedContent.slice(0, firstImportEnd) +
      newImports +
      transformedContent.slice(firstImportEnd)
  }

  // Replace resolve(varName) with the actual value
  variablesToInline.forEach(({ name, value }) => {
    const resolveCallRegex = new RegExp(`resolve\\s*\\(\\s*${name}\\s*\\)`, "g")
    transformedContent = transformedContent.replace(resolveCallRegex, value)
  })

  return transformedContent
}
