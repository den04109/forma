const ALLOWED = ['http:', 'https:', 'mailto:', 'tel:']

// Пользовательские ссылки: допускаем только безопасные схемы (никаких javascript:).
export function safeUrl(raw: string): string | null {
  const v = raw.trim()
  if (!v) return null
  if (v.startsWith('#')) return v
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(v) ? v : `https://${v}`
  try {
    const u = new URL(withScheme)
    return ALLOWED.includes(u.protocol) ? u.href : null
  } catch {
    return null
  }
}

export const isExternal = (href: string) => /^https?:/i.test(href)

const SOCIAL_BASE = {
  github: 'https://github.com/',
  telegram: 'https://t.me/',
  vk: 'https://vk.com/',
  linkedin: 'https://www.linkedin.com/in/',
} as const

export function normalizeSocial(kind: keyof typeof SOCIAL_BASE, raw: string): string | null {
  const v = raw.trim()
  if (!v) return null
  if (v.includes('.') || v.includes('/')) return safeUrl(v)
  return safeUrl(SOCIAL_BASE[kind] + encodeURIComponent(v.replace(/^@/, '')))
}

// Адрес изображения: http(s) или встроенное data:image (используется при экспорте сайта).
export function safeImageUrl(raw: string): string | null {
  const v = raw.trim()
  if (/^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=]+$/i.test(v)) return v
  const u = safeUrl(v)
  return u && /^https?:/i.test(u) ? u : null
}
