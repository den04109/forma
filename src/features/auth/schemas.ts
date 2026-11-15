import { z } from 'zod'

const base = z.object({
  email: z.string().trim().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов').max(72, 'Максимум 72 символа'),
  confirm: z.string().optional(),
})

export type AuthFormValues = z.infer<typeof base>
export const loginSchema = base
export const registerSchema = base.refine((d) => d.confirm === d.password, {
  path: ['confirm'],
  message: 'Пароли не совпадают',
})
