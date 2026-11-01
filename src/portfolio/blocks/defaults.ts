import type { Block, BlockType } from '@/portfolio/types'

export const blockLabels: Record<BlockType, string> = {
  hero: 'Главный экран', about: 'Обо мне', skills: 'Навыки', projects: 'Проекты',
  experience: 'Опыт работы', education: 'Образование', gallery: 'Галерея',
  contact: 'Контакты', socialLinks: 'Соцсети', customText: 'Свой раздел',
}

export const blockTypes = Object.keys(blockLabels) as BlockType[]

const id = () => crypto.randomUUID()

export function createBlock(type: BlockType): Block {
  const base = { id: id(), hidden: false }
  switch (type) {
    case 'hero':
      return { ...base, type, data: { name: 'Имя Фамилия', profession: 'Профессия', description: 'Коротко о себе.', photoUrl: '', buttonLabel: '', buttonUrl: '', align: 'left', photoPosition: 'right' } }
    case 'about':
      return { ...base, type, data: { title: 'Обо мне', text: 'Расскажите о себе.' } }
    case 'skills':
      return { ...base, type, data: { title: 'Навыки', categories: [{ id: id(), name: 'Категория', skills: ['Навык'] }] } }
    case 'projects':
      return { ...base, type, data: { title: 'Проекты', items: [{ id: id(), name: 'Новый проект', description: '', imageUrl: '', url: '', tags: [] }] } }
    case 'experience':
      return { ...base, type, data: { title: 'Опыт работы', items: [{ id: id(), company: 'Компания', position: 'Должность', period: '', description: '' }] } }
    case 'education':
      return { ...base, type, data: { title: 'Образование', items: [{ id: id(), institution: 'Учебное заведение', specialty: '', period: '', details: '' }] } }
    case 'gallery':
      return { ...base, type, data: { title: 'Галерея', columns: 3, items: [] } }
    case 'contact':
      return { ...base, type, data: { title: 'Контакты', email: 'you@example.com', phone: '', links: [] } }
    case 'socialLinks':
      return { ...base, type, data: { github: '', telegram: '', vk: '', linkedin: '', custom: [] } }
    case 'customText':
      return { ...base, type, data: { title: 'Новый раздел', text: 'Добавьте текст.' } }
  }
}
