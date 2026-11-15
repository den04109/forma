// Цвет текста, читаемый на заданном фоне (#rrggbb).
export function readableOn(hex: string): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return '#ffffff'
  const n = parseInt(m[1], 16)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#14121f' : '#ffffff'
}
