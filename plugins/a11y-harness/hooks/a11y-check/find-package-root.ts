import { dirname, sep } from 'node:path'

const PACKAGE_FILE = 'package.json'

export function findPackageRoot(filePath: string, exists: (path: string) => boolean): string | null {
  const segments = dirname(filePath).split(sep)
  const folders = segments.map((_, index) => segments.slice(0, segments.length - index).join(sep))
  return folders.find((folder) => exists(folder + sep + PACKAGE_FILE)) ?? null
}
