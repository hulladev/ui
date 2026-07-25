import { readFile } from "node:fs/promises"
import { dirname, extname, relative, resolve, sep } from "node:path"
import {
  EmitHint,
  ScriptKind,
  ScriptTarget,
  SyntaxKind,
  canHaveModifiers,
  createPrinter,
  createSourceFile,
  factory,
  forEachChild,
  isCallExpression,
  isClassDeclaration,
  isExportDeclaration,
  isFunctionDeclaration,
  isIdentifier,
  isImportDeclaration,
  isImportSpecifier,
  isNamedImports,
  isNamespaceImport,
  isPropertyAccessExpression,
  isPropertyAssignment,
  isShorthandPropertyAssignment,
  isStringLiteral,
  isVariableStatement,
  isVariableDeclaration,
  getModifiers,
  resolveModuleName,
  sys,
  type CompilerOptions,
  type Expression,
  type ImportDeclaration,
  type Node,
  type SourceFile,
  type StringLiteral,
} from "typescript"
import { toPosixPath } from "./paths"

type TextEdit = {
  end: number
  start: number
  text: string
}

type ImportedBinding = {
  declaration: ImportDeclaration
  exportedName: string
  moduleSpecifier: string
}

export type SourceTransformOptions = {
  compilerOptions: CompilerOptions
  destinationPath: string
  framework: string
  sourcePath: string
  sourceToOutput: ReadonlyMap<string, string>
}

const CODE_EXTENSIONS = new Set([".cjs", ".cts", ".js", ".jsx", ".mjs", ".mts", ".ts", ".tsx"])

function applyEdits(content: string, edits: TextEdit[]): string {
  const ordered = [...edits].sort((left, right) => right.start - left.start || right.end - left.end)
  let previousStart = content.length + 1
  let result = content

  for (const edit of ordered) {
    if (edit.end > previousStart) {
      throw new Error(`Overlapping source transformation edits at offset ${edit.start}`)
    }
    result = `${result.slice(0, edit.start)}${edit.text}${result.slice(edit.end)}`
    previousStart = edit.start
  }

  return result
}

function endIncludingLineBreak(content: string, end: number): number {
  const lineBreak = content.slice(end).match(/^[ \t]*\r?\n/)
  return lineBreak ? end + lineBreak[0].length : end
}

function scriptKind(path: string): ScriptKind {
  const extension = extname(path).toLowerCase()
  if (extension === ".tsx") return ScriptKind.TSX
  if (extension === ".jsx") return ScriptKind.JSX
  if ([".js", ".mjs", ".cjs"].includes(extension)) return ScriptKind.JS
  return ScriptKind.TS
}

function sourceFile(path: string, content: string): SourceFile {
  return createSourceFile(path, content, ScriptTarget.Latest, true, scriptKind(path))
}

function resolveImportedModule(
  moduleSpecifier: string,
  importer: string,
  compilerOptions: CompilerOptions
): string {
  const resolved = resolveModuleName(moduleSpecifier, importer, compilerOptions, sys).resolvedModule
  if (!resolved) {
    throw new Error(`Unable to resolve "${moduleSpecifier}" imported by ${importer}`)
  }
  return resolve(resolved.resolvedFileName)
}

function importBindings(declaration: ImportDeclaration): Map<string, string> {
  const bindings = new Map<string, string>()
  const clause = declaration.importClause
  if (!clause) return bindings

  if (clause.name) bindings.set(clause.name.text, "default")
  if (clause.namedBindings && isNamespaceImport(clause.namedBindings)) {
    bindings.set(clause.namedBindings.name.text, "*")
  }
  if (clause.namedBindings && isNamedImports(clause.namedBindings)) {
    for (const element of clause.namedBindings.elements) {
      bindings.set(element.name.text, element.propertyName?.text ?? element.name.text)
    }
  }
  return bindings
}

function collectReferenceNames(node: Node): Set<string> {
  const references = new Set<string>()
  const visit = (current: Node): void => {
    if (isIdentifier(current)) {
      const parent = current.parent
      const isNonReference =
        (isPropertyAccessExpression(parent) && parent.name === current) ||
        (isPropertyAssignment(parent) &&
          parent.name === current &&
          !isShorthandPropertyAssignment(parent)) ||
        (isImportSpecifier(parent) && parent.propertyName === current)
      if (!isNonReference) references.add(current.text)
    }
    forEachChild(current, visit)
  }
  visit(node)
  return references
}

function localTopLevelNames(file: SourceFile): Set<string> {
  const names = new Set<string>()
  for (const statement of file.statements) {
    if (isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (isIdentifier(declaration.name)) names.add(declaration.name.text)
      }
    }
    if ((isFunctionDeclaration(statement) || isClassDeclaration(statement)) && statement.name) {
      names.add(statement.name.text)
    }
  }
  return names
}

function hasExportModifier(statement: Node): boolean {
  return Boolean(
    canHaveModifiers(statement) &&
    getModifiers(statement)?.some((modifier) => modifier.kind === SyntaxKind.ExportKeyword)
  )
}

function findExportedInitializer(file: SourceFile, exportedName: string): Expression {
  for (const statement of file.statements) {
    if (!isVariableStatement(statement) || !hasExportModifier(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (
        isIdentifier(declaration.name) &&
        declaration.name.text === exportedName &&
        declaration.initializer
      ) {
        return declaration.initializer
      }
    }
  }

  throw new Error(
    `Inline target "${exportedName}" must be a directly exported variable with an initializer in ${file.fileName}`
  )
}

function updateImportDeclaration(
  declaration: ImportDeclaration,
  removeLocalNames: ReadonlySet<string>,
  file: SourceFile
): string {
  const clause = declaration.importClause
  if (!clause) return declaration.getText(file)

  const defaultImport =
    clause.name && !removeLocalNames.has(clause.name.text) ? clause.name : undefined
  let namedBindings = clause.namedBindings

  if (namedBindings && isNamespaceImport(namedBindings)) {
    if (removeLocalNames.has(namedBindings.name.text)) namedBindings = undefined
  } else if (namedBindings && isNamedImports(namedBindings)) {
    const elements = namedBindings.elements.filter(
      (element) => !removeLocalNames.has(element.name.text)
    )
    namedBindings =
      elements.length > 0 ? factory.updateNamedImports(namedBindings, elements) : undefined
  }

  if (!defaultImport && !namedBindings) return ""

  const updatedClause = factory.updateImportClause(
    clause,
    clause.isTypeOnly,
    defaultImport,
    namedBindings
  )
  const updated = factory.updateImportDeclaration(
    declaration,
    declaration.modifiers,
    updatedClause,
    declaration.moduleSpecifier,
    declaration.attributes
  )
  return createPrinter().printNode(EmitHint.Unspecified, updated, file)
}

function withoutKnownExtension(path: string): string {
  return path.replace(/(?:\.d)?\.(?:[cm]?[jt]sx?)$/, "")
}

function generatedRelativeSpecifier(
  originalSpecifier: string,
  resolvedSource: string,
  options: SourceTransformOptions
): string {
  const generatedTarget = options.sourceToOutput.get(resolve(resolvedSource))
  if (!generatedTarget) {
    throw new Error(
      `The relative inline dependency "${originalSpecifier}" from ${options.sourcePath} is not emitted. ` +
        `Add it to copyFiles or keep the dependency inside the component.`
    )
  }

  let specifier = toPosixPath(relative(dirname(options.destinationPath), generatedTarget))
  if (!specifier.startsWith(".")) specifier = `./${specifier}`
  if (!extname(originalSpecifier)) specifier = withoutKnownExtension(specifier)
  return specifier
}

function rewriteImportForInline(
  declaration: ImportDeclaration,
  importedFile: string,
  options: SourceTransformOptions
): string {
  const originalText = declaration.getText()
  const moduleNode = declaration.moduleSpecifier
  if (!isStringLiteral(moduleNode) || !moduleNode.text.startsWith(".")) return originalText

  const resolved = resolveImportedModule(moduleNode.text, importedFile, options.compilerOptions)
  const rewritten = generatedRelativeSpecifier(moduleNode.text, resolved, options)
  const start = moduleNode.getStart() - declaration.getStart() + 1
  const end = moduleNode.end - declaration.getStart() - 1
  return `${originalText.slice(0, start)}${rewritten}${originalText.slice(end)}`
}

function importedDependenciesForInitializer(
  file: SourceFile,
  initializer: Expression,
  options: SourceTransformOptions
): string[] {
  const references = collectReferenceNames(initializer)
  const imports: string[] = []

  for (const statement of file.statements) {
    if (!isImportDeclaration(statement)) continue
    const bindings = importBindings(statement)
    const isSideEffect = bindings.size === 0
    if (isSideEffect || [...bindings.keys()].some((name) => references.has(name))) {
      imports.push(rewriteImportForInline(statement, file.fileName, options))
    }
  }

  const importedNames = new Set(
    file.statements
      .filter(isImportDeclaration)
      .flatMap((declaration) => [...importBindings(declaration).keys()])
  )
  const ownName =
    isVariableDeclaration(initializer.parent) && isIdentifier(initializer.parent.name)
      ? initializer.parent.name.text
      : undefined
  const unsupportedLocals = [...localTopLevelNames(file)].filter(
    (name) => name !== ownName && references.has(name) && !importedNames.has(name)
  )
  if (unsupportedLocals.length > 0) {
    throw new Error(
      `Inline initializer in ${file.fileName} depends on local declarations (${unsupportedLocals.join(", ")}). ` +
        `Export a self-contained initializer or move dependencies to imports.`
    )
  }

  return imports
}

function collectImportedBindings(file: SourceFile): Map<string, ImportedBinding> {
  const result = new Map<string, ImportedBinding>()
  for (const statement of file.statements) {
    if (!isImportDeclaration(statement) || !isStringLiteral(statement.moduleSpecifier)) continue
    for (const [localName, exportedName] of importBindings(statement)) {
      result.set(localName, {
        declaration: statement,
        exportedName,
        moduleSpecifier: statement.moduleSpecifier.text,
      })
    }
  }
  return result
}

function assertUniqueImportBindings(content: string, path: string): void {
  const file = sourceFile(path, content)
  const seen = new Set<string>()
  for (const statement of file.statements) {
    if (!isImportDeclaration(statement)) continue
    for (const localName of importBindings(statement).keys()) {
      if (seen.has(localName)) {
        throw new Error(`Generated source has a duplicate import binding "${localName}" in ${path}`)
      }
      seen.add(localName)
    }
  }
}

function consolidateNamedImports(content: string, path: string): string {
  const file = sourceFile(path, content)
  const groups = new Map<string, ImportDeclaration[]>()

  for (const statement of file.statements) {
    if (
      !isImportDeclaration(statement) ||
      !isStringLiteral(statement.moduleSpecifier) ||
      !statement.importClause ||
      statement.importClause.name ||
      !statement.importClause.namedBindings ||
      !isNamedImports(statement.importClause.namedBindings)
    ) {
      continue
    }
    const key = `${statement.importClause.isTypeOnly ? "type" : "value"}:${statement.moduleSpecifier.text}`
    const group = groups.get(key) ?? []
    group.push(statement)
    groups.set(key, group)
  }

  const edits: TextEdit[] = []
  for (const declarations of groups.values()) {
    if (declarations.length < 2) continue
    const first = declarations[0]!
    const firstBindings = first.importClause!.namedBindings
    if (!firstBindings || !isNamedImports(firstBindings)) continue

    const elements = declarations.flatMap((declaration) => {
      const bindings = declaration.importClause?.namedBindings
      return bindings && isNamedImports(bindings) ? [...bindings.elements] : []
    })
    const seen = new Set<string>()
    const uniqueElements = elements.filter((element) => {
      const key = `${element.isTypeOnly}:${element.propertyName?.text ?? element.name.text}:${element.name.text}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    const updatedBindings = factory.updateNamedImports(firstBindings, uniqueElements)
    const updatedClause = factory.updateImportClause(
      first.importClause!,
      first.importClause!.isTypeOnly,
      undefined,
      updatedBindings
    )
    const updated = factory.updateImportDeclaration(
      first,
      first.modifiers,
      updatedClause,
      first.moduleSpecifier,
      first.attributes
    )
    edits.push({
      start: first.getStart(file),
      end: first.end,
      text: createPrinter().printNode(EmitHint.Unspecified, updated, file),
    })
    for (const declaration of declarations.slice(1)) {
      edits.push({
        start: declaration.getStart(file),
        end: endIncludingLineBreak(content, declaration.end),
        text: "",
      })
    }
  }

  return applyEdits(content, edits)
}

function stripFrameworkSuffix(specifier: string, framework: string): string {
  if (!specifier.startsWith(".")) return specifier
  const queryIndex = specifier.search(/[?#]/)
  const path = queryIndex >= 0 ? specifier.slice(0, queryIndex) : specifier
  const trailing = queryIndex >= 0 ? specifier.slice(queryIndex) : ""
  if (
    ["astro", "svelte", "vue"].includes(framework.toLowerCase()) &&
    extname(path).toLowerCase() === `.${framework.toLowerCase()}`
  ) {
    return specifier
  }
  const escapedFramework = framework.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return `${path.replace(new RegExp(`\\.${escapedFramework}(?=(?:\\.[^./?#]+)*$)`), "")}${trailing}`
}

function moduleStringLiterals(file: SourceFile): StringLiteral[] {
  const literals: StringLiteral[] = []
  const visit = (node: Node): void => {
    if (
      (isImportDeclaration(node) || isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      isStringLiteral(node.moduleSpecifier)
    ) {
      literals.push(node.moduleSpecifier)
    }
    const argument = isCallExpression(node) ? node.arguments[0] : undefined
    if (
      isCallExpression(node) &&
      node.arguments.length === 1 &&
      argument &&
      isStringLiteral(argument)
    ) {
      if (node.expression.kind === SyntaxKind.ImportKeyword) literals.push(argument)
      if (isIdentifier(node.expression) && node.expression.text === "require") {
        literals.push(argument)
      }
    }
    forEachChild(node, visit)
  }
  visit(file)
  return literals
}

function rewriteFrameworkSpecifiers(content: string, path: string, framework: string): string {
  const file = sourceFile(path, content)
  const edits: TextEdit[] = []
  for (const literal of moduleStringLiterals(file)) {
    const rewritten = stripFrameworkSuffix(literal.text, framework)
    if (rewritten !== literal.text) {
      edits.push({ start: literal.getStart(file) + 1, end: literal.end - 1, text: rewritten })
    }
  }
  return applyEdits(content, edits)
}

function finalizeScript(content: string, options: SourceTransformOptions): string {
  const rewritten = rewriteFrameworkSpecifiers(content, options.sourcePath, options.framework)
  const consolidated = consolidateNamedImports(rewritten, options.sourcePath)
  assertUniqueImportBindings(consolidated, options.destinationPath)
  return consolidated
}

async function transformScript(content: string, options: SourceTransformOptions): Promise<string> {
  const file = sourceFile(options.sourcePath, content)
  const importedBindings = collectImportedBindings(file)
  const resolveBindings = new Set<string>()

  for (const statement of file.statements) {
    if (
      !isImportDeclaration(statement) ||
      !isStringLiteral(statement.moduleSpecifier) ||
      statement.moduleSpecifier.text !== "@hulla/ui"
    ) {
      continue
    }
    for (const [localName, exportedName] of importBindings(statement)) {
      if (exportedName === "resolve") resolveBindings.add(localName)
    }
  }

  if (resolveBindings.size === 0) {
    return finalizeScript(content, options)
  }

  const calls: Array<{ argument: string; end: number; resolveName: string; start: number }> = []
  const visit = (node: Node): void => {
    if (
      isCallExpression(node) &&
      isIdentifier(node.expression) &&
      resolveBindings.has(node.expression.text)
    ) {
      const argument = node.arguments[0]
      if (node.arguments.length !== 1 || !argument || !isIdentifier(argument)) {
        throw new Error(
          `${node.expression.text}(...) in ${options.sourcePath} requires exactly one imported identifier`
        )
      }
      calls.push({
        argument: argument.text,
        end: node.end,
        resolveName: node.expression.text,
        start: node.getStart(file),
      })
    }
    forEachChild(node, visit)
  }
  visit(file)

  if (calls.length === 0) {
    return finalizeScript(content, options)
  }

  const removals = new Map<ImportDeclaration, Set<string>>()
  const dependencyImports = new Set<string>()
  const initializerByArgument = new Map<string, string>()

  for (const call of calls) {
    const binding = importedBindings.get(call.argument)
    if (!binding || binding.moduleSpecifier === "@hulla/ui") {
      throw new Error(
        `Inline argument "${call.argument}" in ${options.sourcePath} must be imported from a source module`
      )
    }

    if (!initializerByArgument.has(call.argument)) {
      const importedPath = resolveImportedModule(
        binding.moduleSpecifier,
        options.sourcePath,
        options.compilerOptions
      )
      if (importedPath.includes(`${sep}node_modules${sep}`)) {
        throw new Error(`Refusing to inline third-party module: ${binding.moduleSpecifier}`)
      }

      const importedContent = await readFile(importedPath, "utf8")
      const importedFile = sourceFile(importedPath, importedContent)
      const initializer = findExportedInitializer(importedFile, binding.exportedName)
      initializerByArgument.set(call.argument, initializer.getText(importedFile))
      for (const dependency of importedDependenciesForInitializer(
        importedFile,
        initializer,
        options
      )) {
        dependencyImports.add(dependency)
      }
    }

    const names = removals.get(binding.declaration) ?? new Set<string>()
    names.add(call.argument)
    removals.set(binding.declaration, names)

    const resolveBinding = importedBindings.get(call.resolveName)
    if (resolveBinding) {
      const resolveNames = removals.get(resolveBinding.declaration) ?? new Set<string>()
      resolveNames.add(call.resolveName)
      removals.set(resolveBinding.declaration, resolveNames)
    }
  }

  const edits: TextEdit[] = calls.map((call) => ({
    start: call.start,
    end: call.end,
    text: initializerByArgument.get(call.argument)!,
  }))
  for (const [declaration, names] of removals) {
    const replacement = updateImportDeclaration(declaration, names, file)
    if (replacement && isStringLiteral(declaration.moduleSpecifier)) {
      const importedPath = resolveImportedModule(
        declaration.moduleSpecifier.text,
        options.sourcePath,
        options.compilerOptions
      )
      if (!options.sourceToOutput.has(importedPath)) {
        throw new Error(
          `Import ${declaration.moduleSpecifier.getText(file)} in ${options.sourcePath} mixes inlined and runtime bindings, ` +
            `but the source module is not emitted. Split the imports or add the module to copyFiles.`
        )
      }
    }
    edits.push({
      start: declaration.getStart(file),
      end: replacement ? declaration.end : endIncludingLineBreak(content, declaration.end),
      text: replacement,
    })
  }

  let transformed = applyEdits(content, edits)
  if (dependencyImports.size > 0) {
    transformed = `${[...dependencyImports].sort().join("\n")}\n${transformed}`
  }
  return finalizeScript(transformed, options)
}

function transformEmbeddedScripts(
  content: string,
  options: SourceTransformOptions,
  pattern: RegExp
): Promise<string> {
  const matches = [...content.matchAll(pattern)]
  return Promise.all(
    matches.map(async (match) => {
      const full = match[0]
      const script = match[1] ?? ""
      const fullStart = match.index ?? 0
      const scriptOffset = full.indexOf(script)
      const transformed = await transformScript(script, options)
      return {
        start: fullStart + scriptOffset,
        end: fullStart + scriptOffset + script.length,
        text: transformed,
      }
    })
  ).then((edits) => applyEdits(content, edits))
}

async function transformAstroSource(
  content: string,
  options: SourceTransformOptions
): Promise<string> {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!frontmatter) return content

  const full = frontmatter[0]
  const script = frontmatter[1] ?? ""
  const scriptOffset = full.indexOf(script)
  const template = content.slice(full.length)
  const file = sourceFile(options.sourcePath, script)
  const resolveNames = new Set<string>()

  for (const statement of file.statements) {
    if (
      !isImportDeclaration(statement) ||
      !isStringLiteral(statement.moduleSpecifier) ||
      statement.moduleSpecifier.text !== "@hulla/ui"
    ) {
      continue
    }
    for (const [localName, exportedName] of importBindings(statement)) {
      if (exportedName === "resolve") resolveNames.add(localName)
    }
  }

  if (resolveNames.size === 0) {
    const transformed = await transformScript(script, options)
    return `${content.slice(0, scriptOffset)}${transformed}${content.slice(
      scriptOffset + script.length
    )}`
  }

  const resolvePattern = [...resolveNames]
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")
  const callPattern = new RegExp(
    `(?<![\\w$.])(?:${resolvePattern})\\s*\\(\\s*([A-Za-z_$][\\w$]*)\\s*\\)`,
    "g"
  )
  const templateCalls = [...template.matchAll(callPattern)]
  if (templateCalls.length === 0) {
    const transformed = await transformScript(script, options)
    return `${content.slice(0, scriptOffset)}${transformed}${content.slice(
      scriptOffset + script.length
    )}`
  }

  const variableByArgument = new Map<string, string>()
  for (const match of templateCalls) {
    const argument = match[1]!
    if (!variableByArgument.has(argument)) {
      variableByArgument.set(argument, `__hullaAstroInline${variableByArgument.size}`)
    }
  }

  const sentinel = "\n;/* __HULLA_ASTRO_TEMPLATE_INLINES__ */\n"
  const syntheticDeclarations = [...variableByArgument]
    .map(([argument, variable]) => `export const ${variable} = resolve(${argument})`)
    .join("\n")
  const transformed = await transformScript(`${script}${sentinel}${syntheticDeclarations}`, options)
  const sentinelIndex = transformed.indexOf(sentinel)
  if (sentinelIndex < 0) {
    throw new Error(`Failed to transform Astro template expressions in ${options.sourcePath}`)
  }

  const transformedScript = transformed.slice(0, sentinelIndex)
  const syntheticFile = sourceFile(options.sourcePath, transformed.slice(sentinelIndex + 1))
  const initializerByArgument = new Map<string, string>()
  for (const [argument, variable] of variableByArgument) {
    initializerByArgument.set(
      argument,
      findExportedInitializer(syntheticFile, variable).getText(syntheticFile)
    )
  }

  const transformedTemplate = applyEdits(
    template,
    templateCalls.map((match) => ({
      start: match.index ?? 0,
      end: (match.index ?? 0) + match[0].length,
      text: initializerByArgument.get(match[1]!)!,
    }))
  )

  return `${content.slice(0, scriptOffset)}${transformedScript}${content.slice(
    scriptOffset + script.length,
    full.length
  )}${transformedTemplate}`
}

export async function transformSource(
  content: string,
  options: SourceTransformOptions
): Promise<string> {
  const extension = extname(options.sourcePath).toLowerCase()
  if (CODE_EXTENSIONS.has(extension)) return transformScript(content, options)

  if (extension === ".astro") {
    return transformAstroSource(content, options)
  }

  if (extension === ".vue" || extension === ".svelte") {
    return transformEmbeddedScripts(content, options, /<script\b[^>]*>([\s\S]*?)<\/script>/gi)
  }

  return content
}

export function getGeneratedOutputFilename(name: string, framework: string): string {
  const escapedFramework = framework.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const indexVariant = name.match(new RegExp(`^index\\..+\\.${escapedFramework}((?:\\.[^.]+)+)$`))
  if (indexVariant?.[1]) return `index${indexVariant[1]}`

  return name.replace(new RegExp(`\\.${escapedFramework}(?=(?:\\.[^.]+)+$)`), "")
}

export function isTransformableSource(path: string): boolean {
  const extension = extname(path).toLowerCase()
  return CODE_EXTENSIONS.has(extension) || [".astro", ".svelte", ".vue"].includes(extension)
}
