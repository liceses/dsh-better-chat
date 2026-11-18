import { build } from 'esbuild'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'lib')
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))

await rm(out, { recursive: true, force: true })
await mkdir(join(out, 'preset'), { recursive: true })

const shared = {
  bundle: true,
  legalComments: 'none',
  logLevel: 'info',
  sourcemap: false,
  target: ['es2022'],
  define: {
    'process.env.NODE_ENV': '"production"',
    'globalThis.process.env.NODE_ENV': '"production"',
  },
}

await build({
  ...shared,
  entryPoints: [join(root, 'src/index.ts')],
  outfile: join(out, 'index.js'),
  format: 'esm',
  platform: 'node',
  external: ['@deepseek-ai/*'],
})

const clientOut = join(root, '.build/client.cjs')
await build({
  ...shared,
  entryPoints: [join(root, 'src/client/index.tsx')],
  outfile: clientOut,
  format: 'cjs',
  platform: 'browser',
  jsx: 'automatic',
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'react-dom/client',
    '@deepseek-ai/*',
  ],
})

const factoryBody = await readFile(clientOut, 'utf8')
const wrapped = [
  'window.__ModuleLoader__.load({ id: ' + JSON.stringify(pkg.name) + ', factory: (require) => {',
  'var module = { exports: {} }; var exports = module.exports;',
  factoryBody.trimEnd(),
  'return module.exports; } });',
  '',
].join('\n')
await writeFile(join(out, 'client.js'), wrapped, 'utf8')
await rm(join(root, '.build'), { recursive: true, force: true })

await cp(join(root, 'src/preset/tool-filter.mjs'), join(out, 'preset/tool-filter.mjs'))
console.log('[' + pkg.name + '] built lib/index.js, lib/client.js, lib/preset/tool-filter.mjs')
