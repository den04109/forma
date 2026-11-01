import { z } from 'zod'

const RESERVED = ['app', 'login', 'register', 'admin', 'api', 'p', 'settings', 'new']

// Правила совпадают с CHECK-ограничением в БД.
export const slugSchema = z
  .string()
  .min(3, 'Минимум 3 символа')
  .max(40, 'Максимум 40 символов')
  .regex(/^[a-z0-9-]+$/, 'Только латинские буквы, цифры и дефис')
  .regex(/^[a-z0-9].*[a-z0-9]$/, 'Адрес не должен начинаться или заканчиваться дефисом')
  .refine((s) => !s.includes('--'), 'Нельзя использовать два дефиса подряд')
  .refine((s) => !RESERVED.includes(s), 'Этот адрес зарезервирован')

export function suggestSlug(title: string): string {
  const s = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return s.length >= 3 ? s.slice(0, 40) : ''
}
