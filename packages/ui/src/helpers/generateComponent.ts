import { Dirent } from "node:fs"
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
import { BuildCache } from "../buildCache"
import { Frameworks } from "../types.public"
import { resolvePathAlias, resolveTsconfigPath } from "./parser"

type TransformFileParams = {
  dirent: Dirent
  framework: Frameworks[number]
  outputPath: string
  tsconfigPath?: string
  cache: BuildCache
  resolvedTsconfig?: string | null
}

export async function generateComponent({
  dirent,
  framework,
  outputPath,
  tsconfigPath,
  cache,
  resolvedTsconfig,
}: TransformFileParams) {
  if (dirent.isDirectory()) {
    const dirOutputPath = join(outputPath, dirent.name)
    await mkdir(dirOutputPath, { recursive: true })

    // Resolve tsconfig once for the directory
    const subDirPath = join(dirent.parentPath, dirent.name)
    const resolved = resolvedTsconfig || (await resolveTsconfigPath(subDirPath, tsconfigPath))

    const subDirContents = await readdir(subDirPath, { withFileTypes: true })
    await Promise.all(
      subDirContents.map((subDirent) =>
        generateComponent({
          dirent: subDirent,
          framework,
          outputPath: dirOutputPath,
          tsconfigPath,
          cache,
          resolvedTsconfig: resolved,
        })
      )
    )
  } else {
    const sourcePath = join(dirent.parentPath, dirent.name)

    if (dirent.name === "package.json") {
      const destPath = join(outputPath, dirent.name)
      await copyFile(sourcePath, destPath)
      await cache.markFileProcessed(sourcePath)
    } else {
      // Resolve tsconfig once if not already resolved
      const resolved =
        resolvedTsconfig || (await resolveTsconfigPath(dirent.parentPath, tsconfigPath))
      if (!resolved) {
        throw new Error(`Failed to resolve tsconfig for ${sourcePath}`)
      }

      const fileContents = await readFile(sourcePath, {
        encoding: "utf-8",
      })
      const transformedContent = await transformFile(
        fileContents,
        sourcePath,
        dirent.parentPath,
        resolved,
        framework
      )
      const outputFilename = getGeneratedOutputFilename(dirent.name, framework)
      const destPath = join(outputPath, outputFilename)
      await writeFile(destPath, transformedContent, "utf-8")
      await cache.markFileProcessed(sourcePath)
    }
  }
}

async function transformFile(
  fileContents: string,
  sourceFilePath: string,
  sourceFileDir: string,
  resolvedTsconfigPath: string,
  framework: Frameworks[number]
): Promise<string> {
  const sourceFile = createSourceFile(sourceFilePath, fileContents, ScriptTarget.Latest, true)

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
    return rewriteImportSpecifiers(fileContents, framework)
  }

  // Find imports for each resolve argument
  const importMap = new Map<
    string,
    { exportedName: string; moduleSpecifier: string; importClause: string }
  >()
  sourceFile.statements.forEach((statement) => {
    if (isImportDeclaration(statement)) {
      const moduleSpecifier = (statement.moduleSpecifier as StringLiteral).text

      if (statement.importClause) {
        const namedBindings = statement.importClause.namedBindings
        if (namedBindings && isNamedImports(namedBindings)) {
          namedBindings.elements.forEach((element) => {
            const localName = element.name.text
            const exportedName = element.propertyName?.text ?? localName
            if (resolveCallArgs.includes(localName)) {
              importMap.set(localName, {
                exportedName,
                moduleSpecifier,
                importClause: fileContents.substring(statement.pos, statement.end).trim(),
              })
              importsToRemove.add(moduleSpecifier)
            }
          })
        }
      }

      // Remove resolve imports after all resolve(...) calls are inlined.
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
            if (
              isIdentifier(declaration.name) &&
              declaration.name.text === importInfo.exportedName
            ) {
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
      throw new Error(
        `Cannot find exported declaration for "${importInfo.exportedName}" in ${resolvedPath}`
      )
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

  return rewriteImportSpecifiers(transformedContent, framework)
}

export function getGeneratedOutputFilename(name: string, framework: Frameworks[number]): string {
  const indexVariantRegex = new RegExp(`^index\\..+\\.${escapeRegExp(framework)}((?:\\.[^.]+)+)$`)
  const indexVariantMatch = name.match(indexVariantRegex)
  if (indexVariantMatch) {
    return `index${indexVariantMatch[1]}`
  }

  const frameworkSuffixRegex = new RegExp(`\\.${escapeRegExp(framework)}(?=(?:\\.[^.]+)+$)`)
  return frameworkSuffixRegex.test(name) ? name.replace(frameworkSuffixRegex, "") : name
}

function rewriteImportSpecifiers(content: string, framework: Frameworks[number]): string {
  const rewrite = (moduleSpecifier: string): string => {
    if (!isLikelyRelativeSpecifier(moduleSpecifier)) {
      return moduleSpecifier
    }
    return stripFrameworkSuffix(moduleSpecifier, framework)
  }

  let rewrittenContent = content
  const importPatterns = [
    /(from\s+["'])([^"']+)(["'])/g,
    /(import\s+["'])([^"']+)(["'])/g,
    /(import\s*\(\s*["'])([^"']+)(["']\s*\))/g,
    /(require\s*\(\s*["'])([^"']+)(["']\s*\))/g,
  ]

  for (const pattern of importPatterns) {
    rewrittenContent = rewrittenContent.replace(pattern, (_match, prefix, specifier, suffix) => {
      return `${prefix}${rewrite(specifier)}${suffix}`
    })
  }

  return rewrittenContent
}

function isLikelyRelativeSpecifier(specifier: string): boolean {
  if (specifier.startsWith(".") || specifier.startsWith("..")) {
    return true
  }

  if (specifier.includes("/") || specifier.startsWith("@") || specifier.includes(":")) {
    return false
  }

  return true
}

function stripFrameworkSuffix(specifier: string, framework: Frameworks[number]): string {
  const queryOrHashIndex = specifier.search(/[?#]/)
  const basePath = queryOrHashIndex >= 0 ? specifier.slice(0, queryOrHashIndex) : specifier
  const trailing = queryOrHashIndex >= 0 ? specifier.slice(queryOrHashIndex) : ""
  const frameworkSuffixRegex = new RegExp(`\\.${escapeRegExp(framework)}(?=(?:\\.[^./?#]+)*$)`)

  if (!frameworkSuffixRegex.test(basePath)) {
    return specifier
  }

  const strippedPath = basePath.replace(frameworkSuffixRegex, "")
  const normalizedPath = strippedPath.startsWith(".") ? strippedPath : `./${strippedPath}`

  return `${normalizedPath}${trailing}`
}

function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
