import { createHash } from "node:crypto"
import { existsSync } from "node:fs"
import { mkdir, readFile, stat, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { cwd } from "node:process"
import { formatPath, log } from "./helpers/log"

interface CacheEntry {
  timestamp: number
  hash: string
}

interface CacheManifest {
  files: Record<string, CacheEntry>
  version: string
}

export class BuildCache {
  private cacheFilePath: string
  private manifest: CacheManifest
  private dirty = false
  private static readonly CACHE_VERSION = "1.0.0"

  constructor(basePath: string = cwd()) {
    this.cacheFilePath = join(basePath, ".hulla", ".cache", "ui-cache.json")
    this.manifest = {
      files: {},
      version: BuildCache.CACHE_VERSION,
    }
  }

  /**
   * Load the cache from disk
   */
  async load(): Promise<void> {
    try {
      if (existsSync(this.cacheFilePath)) {
        const content = await readFile(this.cacheFilePath, "utf-8")
        const cached = JSON.parse(content) as CacheManifest

        // Invalidate cache if version mismatch
        if (cached.version === BuildCache.CACHE_VERSION) {
          this.manifest = cached
        } else {
          log.warn("cache version mismatch, invalidating")
          this.manifest = {
            files: {},
            version: BuildCache.CACHE_VERSION,
          }
          this.dirty = true
        }
      }
    } catch (error) {
      log.error("failed loading cache, starting fresh", error)
      this.manifest = {
        files: {},
        version: BuildCache.CACHE_VERSION,
      }
    }
  }

  /**
   * Check if a file has changed since last build
   * Uses combined approach: timestamp for quick check, hash for verification
   */
  async hasFileChanged(filePath: string): Promise<boolean> {
    try {
      const stats = await stat(filePath)
      const cached = this.manifest.files[filePath]

      // File not in cache = changed
      if (!cached) {
        return true
      }

      // Quick check: if timestamp unchanged, file hasn't changed
      if (stats.mtimeMs === cached.timestamp) {
        return false
      }

      // Timestamp changed - verify with hash
      const currentHash = await this.hashFile(filePath)
      return currentHash !== cached.hash
    } catch {
      // File doesn't exist or error reading = changed
      return true
    }
  }

  /**
   * Check if any file in a list has changed
   */
  async hasAnyFileChanged(filePaths: string[]): Promise<boolean> {
    const checks = await Promise.all(filePaths.map((path) => this.hasFileChanged(path)))
    return checks.some((changed) => changed)
  }

  /**
   * Mark a file as processed in the current build
   */
  async markFileProcessed(filePath: string): Promise<void> {
    try {
      const stats = await stat(filePath)
      const hash = await this.hashFile(filePath)

      this.manifest.files[filePath] = {
        timestamp: stats.mtimeMs,
        hash,
      }
      this.dirty = true
    } catch (error) {
      log.error(`failed marking file as processed (${formatPath(filePath)})`, error)
    }
  }

  /**
   * Mark multiple files as processed
   */
  async markFilesProcessed(filePaths: string[]): Promise<void> {
    await Promise.all(filePaths.map((path) => this.markFileProcessed(path)))
  }

  /**
   * Save the cache to disk
   */
  async save(): Promise<void> {
    if (!this.dirty) {
      return
    }

    try {
      const dir = dirname(this.cacheFilePath)
      await mkdir(dir, { recursive: true })
      await writeFile(this.cacheFilePath, JSON.stringify(this.manifest, null, 2), "utf-8")
      this.dirty = false
    } catch (error) {
      log.error("failed saving cache", error)
    }
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.manifest = {
      files: {},
      version: BuildCache.CACHE_VERSION,
    }
    this.dirty = true
  }

  /**
   * Remove specific files from cache
   */
  removeFiles(filePaths: string[]): void {
    for (const path of filePaths) {
      delete this.manifest.files[path]
    }
    this.dirty = true
  }

  /**
   * Get cache statistics
   */
  getStats(): { totalFiles: number; cacheHits: number; cacheMisses: number } {
    return {
      totalFiles: Object.keys(this.manifest.files).length,
      cacheHits: 0, // Will be tracked during build
      cacheMisses: 0, // Will be tracked during build
    }
  }

  /**
   * Hash a file's contents using SHA-256
   */
  private async hashFile(filePath: string): Promise<string> {
    const content = await readFile(filePath)
    return createHash("sha256").update(content).digest("hex")
  }
}
