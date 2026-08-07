import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { render } from '../dist-ssr/entry-server.js'

const outputPath = resolve('dist/index.html')
const template = await readFile(outputPath, 'utf8')
const html = template.replace('<div id="root"></div>', `<div id="root">${render()}</div>`)

if (html === template) {
  throw new Error('Prerender nije pronašao #root element u dist/index.html')
}

await writeFile(outputPath, html)
console.log('Prerenderovan dist/index.html')
