import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const repoRoot = resolve(process.cwd(), '..')

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) {
      return entry.name === '__tests__' || entry.name === 'node_modules' ? [] : sourceFiles(path)
    }
    return /\.(?:md|mdx|ts|tsx|vue)$/.test(entry.name) && !entry.name.includes('.spec.') ? [path] : []
  })
}

describe('external traffic policy', () => {
  it('does not ship the third-party image key export flow', () => {
    const removedModule = resolve(repoRoot, 'frontend/src/utils/imagePlaygroundImport.ts')
    const keysView = readFileSync(resolve(repoRoot, 'frontend/src/views/user/KeysView.vue'), 'utf8')

    expect(existsSync(removedModule)).toBe(false)
    expect(keysView).not.toContain('buildImagePlaygroundImportUrl')
  })

  it('does not reference blocked author-controlled hosts in runtime sources', () => {
    const blockedHosts = [
      ['image', ['ai', 'pixel'].join('-'), 'online'].join('.'),
      ['ghcr.io', ['pixel', 'api'].join('-')].join('/'),
      ['github.com', ['PIXEL', 'API'].join('-'), 'PixelAPI'].join('/'),
      ['raw.githubusercontent.com', ['PIXEL', 'API'].join('-'), 'PixelAPI'].join('/')
    ].map((value) => value.toLowerCase())

    const files = [
      ...sourceFiles(resolve(repoRoot, 'frontend/src')),
      ...sourceFiles(resolve(repoRoot, 'docs/site')),
      resolve(repoRoot, 'README.md'),
      resolve(repoRoot, 'README_EN.md'),
      resolve(repoRoot, 'Dockerfile'),
      resolve(repoRoot, 'Dockerfile.goreleaser'),
      resolve(repoRoot, 'deploy/Dockerfile'),
      resolve(repoRoot, 'deploy/docker-compose.yml'),
      resolve(repoRoot, 'deploy/docker-compose.local.yml'),
      resolve(repoRoot, 'deploy/install.sh'),
      resolve(repoRoot, 'deploy/sub2api.service')
    ]

    const violations = files.flatMap((file) => {
      const content = readFileSync(file, 'utf8').toLowerCase()
      return blockedHosts.filter((host) => content.includes(host)).map((host) => `${file}: ${host}`)
    })

    expect(violations).toEqual([])
  })
})
