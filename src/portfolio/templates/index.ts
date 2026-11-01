import type { Block, PortfolioDocument, TemplateId, Theme } from '@/portfolio/types'

export interface TemplateMeta {
  id: TemplateId
  name: string
  description: string
  accent: string
  theme: Theme
}

export const templates: Record<TemplateId, TemplateMeta> = {
  minimal: {
    id: 'minimal', name: 'Minimal', accent: '#6a45f5',
    description: 'Строгий и минималистичный, с акцентом на типографику.',
    theme: { primaryColor: '#6a45f5', backgroundColor: '#ffffff', textColor: '#14121f', fontFamily: 'inter', headingScale: 1.15, radius: 'sm', buttonStyle: 'solid', contentWidth: 'narrow' },
  },
  creative: {
    id: 'creative', name: 'Creative', accent: '#e8590c',
    description: 'Яркий и необычный, для дизайнеров и творческих специалистов.',
    theme: { primaryColor: '#e8590c', backgroundColor: '#fff8f0', textColor: '#2b1a0f', fontFamily: 'manrope', headingScale: 1.3, radius: 'full', buttonStyle: 'solid', contentWidth: 'normal' },
  },
  professional: {
    id: 'professional', name: 'Professional', accent: '#0b7285',
    description: 'Сдержанный и структурированный, для делового портфолио.',
    theme: { primaryColor: '#0b7285', backgroundColor: '#f8f9fa', textColor: '#212529', fontFamily: 'inter', headingScale: 1, radius: 'md', buttonStyle: 'outline', contentWidth: 'wide' },
  },
}

export const templateList = Object.values(templates)

const id = () => crypto.randomUUID()

// Демонстрационные данные: пользователь заменяет их своими.
export function createDemoDocument(templateId: TemplateId): PortfolioDocument {
  const blocks: Block[] = [
    { id: id(), type: 'hero', hidden: false, data: {
      name: 'Имя Фамилия', profession: 'Ваша профессия',
      description: 'Коротко расскажите, чем вы занимаетесь и в чём ваша сильная сторона.',
      photoUrl: '', buttonLabel: 'Связаться со мной', buttonUrl: '#contact',
      align: templateId === 'creative' ? 'center' : 'left', photoPosition: 'right' } },
    { id: id(), type: 'about', hidden: false, data: {
      title: 'Обо мне', text: 'Здесь расскажите о своём опыте, подходе к работе и интересах.' } },
    { id: id(), type: 'skills', hidden: false, data: { title: 'Навыки', categories: [
      { id: id(), name: 'Основные', skills: ['Навык 1', 'Навык 2', 'Навык 3'] },
      { id: id(), name: 'Инструменты', skills: ['Инструмент 1', 'Инструмент 2'] } ] } },
    { id: id(), type: 'projects', hidden: false, data: { title: 'Проекты', items: [
      { id: id(), name: 'Название проекта', description: 'Опишите задачу и результат.', imageUrl: '', url: '', tags: ['Тег'] },
      { id: id(), name: 'Другой проект', description: 'Чем он был полезен.', imageUrl: '', url: '', tags: ['Тег'] } ] } },
    { id: id(), type: 'experience', hidden: false, data: { title: 'Опыт работы', items: [
      { id: id(), company: 'Компания', position: 'Должность', period: '2022 — настоящее время', description: 'Ключевые задачи и достижения.' } ] } },
    { id: id(), type: 'education', hidden: false, data: { title: 'Образование', items: [
      { id: id(), institution: 'Учебное заведение', specialty: 'Специальность', period: '2018 — 2022', details: '' } ] } },
    { id: id(), type: 'contact', hidden: false, data: { title: 'Контакты', email: 'you@example.com', phone: '', links: [] } },
  ]
  return {
    version: 1,
    theme: { ...templates[templateId].theme },
    seo: { title: 'Имя Фамилия — портфолио', description: 'Персональное портфолио' },
    blocks,
  }
}
