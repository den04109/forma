import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PortfolioRenderer } from '@/portfolio/renderer/PortfolioRenderer'
import { fontFaceNames } from '@/portfolio/renderer/fonts'
import type { Block, PortfolioDocument } from '@/portfolio/types'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function toDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.onerror = () => reject(r.error)
    r.readAsDataURL(blob)
  })
}

async function fetchDataUrl(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return toDataUrl(await res.blob())
}

function mapImages(doc: PortfolioDocument, fn: (url: string) => string): PortfolioDocument {
  const blocks = doc.blocks.map((b) => {
    if (b.type === 'hero') return { ...b, data: { ...b.data, photoUrl: fn(b.data.photoUrl) } }
    if (b.type === 'projects') return { ...b, data: { ...b.data, items: b.data.items.map((i) => ({ ...i, imageUrl: fn(i.imageUrl) })) } }
    if (b.type === 'gallery') return { ...b, data: { ...b.data, items: b.data.items.map((i) => ({ ...i, imageUrl: fn(i.imageUrl) })) } }
    return b
  }) as Block[]
  return { ...doc, blocks }
}

// Все изображения встраиваются в страницу, чтобы файл не зависел от Forma.
async function inlineImages(doc: PortfolioDocument): Promise<{ doc: PortfolioDocument; failed: number }> {
  const urls = new Set<string>()
  mapImages(doc, (u) => { if (/^https?:/i.test(u.trim())) urls.add(u.trim()); return u })
  const done = new Map<string, string>()
  let failed = 0
  await Promise.all([...urls].map(async (u) => {
    try { done.set(u, await fetchDataUrl(u)) } catch { failed += 1 }
  }))
  return { doc: mapImages(doc, (u) => done.get(u.trim()) ?? u), failed }
}

// Стили берём из загруженного приложения; шрифты встраиваем только используемые (кириллица и латиница).
async function buildCss(families: string[]): Promise<string> {
  const rules: string[] = []
  const faces: Promise<string>[] = []
  for (const sheet of Array.from(document.styleSheets)) {
    let list: CSSRuleList
    try { list = sheet.cssRules } catch { continue }
    for (const rule of Array.from(list)) {
      if (!(rule instanceof CSSFontFaceRule)) { rules.push(rule.cssText); continue }
      const st = rule.style
      const family = st.getPropertyValue('font-family').replace(/["']/g, '').trim()
      const range = st.getPropertyValue('unicode-range')
      const src = /url\(["']?([^"')]+\.woff2)["']?\)/.exec(st.getPropertyValue('src'))
      if (!families.includes(family) || !src || !/U\+0400|U\+0000-00FF/i.test(range)) continue
      const url = new URL(src[1], sheet.href ?? document.baseURI).href
      const weight = st.getPropertyValue('font-weight') || '400'
      faces.push(fetchDataUrl(url).then((data) =>
        `@font-face{font-family:"${family}";font-style:normal;font-display:swap;font-weight:${weight};src:url(${data}) format("woff2");unicode-range:${range}}`,
      ).catch(() => ''))
    }
  }
  return [...(await Promise.all(faces)), ...rules].join('\n')
}

export async function buildSiteHtml(source: PortfolioDocument): Promise<{ html: string; failedImages: number }> {
  const { doc, failed } = await inlineImages(source)
  const keys = new Set([doc.theme.fontFamily, ...doc.blocks.flatMap((b) => (b.style?.fontFamily ? [b.style.fontFamily] : []))])
  const css = await buildCss([...keys].map((k) => fontFaceNames[k]))
  const markup = renderToStaticMarkup(createElement(PortfolioRenderer, { document: doc }))
  const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(doc.seo.title || 'Портфолио')}</title>
<meta name="description" content="${esc(doc.seo.description)}">
<style>
${css}
html,body{margin:0;background:${esc(doc.theme.backgroundColor)}}
</style>
</head>
<body>
${markup}
</body>
</html>
`
  return { html, failedImages: failed }
}

export function downloadHtml(html: string, filename = 'index.html') {
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
