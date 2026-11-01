import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/features/auth/authStore'

const BUCKET = 'portfolio-images'
const MAX_BYTES = 5 * 1024 * 1024
const MAX_SIDE = 1600
const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// Оптимизация: уменьшаем до 1600 px по длинной стороне и сохраняем как WebP.
async function toWebp(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bmp.width * scale)
  canvas.height = Math.round(bmp.height * scale)
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height)
  bmp.close()
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Не удалось обработать изображение'))), 'image/webp', 0.85),
  )
}

export async function uploadImage(file: File): Promise<string> {
  if (!TYPES.includes(file.type)) throw new Error('Допустимы форматы JPEG, PNG, WebP и GIF')
  if (file.size > MAX_BYTES) throw new Error('Размер файла не должен превышать 5 МБ')
  const user = useAuthStore.getState().user
  if (!user) throw new Error('Требуется вход в аккаунт')
  const gif = file.type === 'image/gif'
  const body: Blob = gif ? file : await toWebp(file)
  const path = `${user.id}/${crypto.randomUUID()}.${gif ? 'gif' : 'webp'}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, body, { contentType: body.type, cacheControl: '31536000' })
  if (error) throw new Error(error.message)
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}
