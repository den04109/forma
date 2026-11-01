export type TemplateId = 'minimal' | 'creative' | 'professional'
export type PortfolioStatus = 'draft' | 'published'

export interface Theme {
  primaryColor: string
  backgroundColor: string
  textColor: string
  fontFamily: 'inter' | 'manrope' | 'playfair' | 'jetbrains'
  headingScale: 0.85 | 1 | 1.15 | 1.3
  radius: 'none' | 'sm' | 'md' | 'lg' | 'full'
  buttonStyle: 'solid' | 'outline' | 'ghost'
  contentWidth: 'narrow' | 'normal' | 'wide'
}

export interface SeoSettings {
  title: string
  description: string
}

export interface BlockStyle {
  fontFamily?: Theme['fontFamily']
  scale?: number
  textColor?: string
  bgColor?: string
  align?: 'left' | 'center' | 'right'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

interface BlockBase<T extends string, D> {
  id: string
  type: T
  hidden: boolean
  style?: BlockStyle
  data: D
}

export interface Link {
  id: string
  label: string
  url: string
}

export type HeroBlock = BlockBase<'hero', {
  name: string
  profession: string
  description: string
  photoUrl: string
  buttonLabel: string
  buttonUrl: string
  align: 'left' | 'center' | 'right'
  photoPosition: 'left' | 'right' | 'top'
  photoSize?: number
}>

export type AboutBlock = BlockBase<'about', { title: string; text: string }>

export type SkillsBlock = BlockBase<'skills', {
  title: string
  categories: { id: string; name: string; skills: string[] }[]
}>

export type ProjectsBlock = BlockBase<'projects', {
  title: string
  items: {
    id: string
    name: string
    description: string
    imageUrl: string
    url: string
    tags: string[]
    imageWidth?: number
  }[]
}>

export type ExperienceBlock = BlockBase<'experience', {
  title: string
  items: { id: string; company: string; position: string; period: string; description: string }[]
}>

export type EducationBlock = BlockBase<'education', {
  title: string
  items: { id: string; institution: string; specialty: string; period: string; details: string }[]
}>

export type GalleryBlock = BlockBase<'gallery', {
  title: string
  columns: 2 | 3 | 4
  items: { id: string; imageUrl: string; title: string; caption: string }[]
}>

export type ContactBlock = BlockBase<'contact', {
  title: string
  email: string
  phone: string
  links: Link[]
}>

export type SocialLinksBlock = BlockBase<'socialLinks', {
  github: string
  telegram: string
  vk: string
  linkedin: string
  custom: Link[]
}>

export type CustomTextBlock = BlockBase<'customText', { title: string; text: string }>

export type Block =
  | HeroBlock | AboutBlock | SkillsBlock | ProjectsBlock | ExperienceBlock
  | EducationBlock | GalleryBlock | ContactBlock | SocialLinksBlock | CustomTextBlock

export type BlockType = Block['type']

export interface PortfolioDocument {
  version: 1
  theme: Theme
  seo: SeoSettings
  blocks: Block[]
}

export interface Portfolio {
  id: string
  user_id: string
  title: string
  slug: string | null
  status: PortfolioStatus
  template_id: TemplateId
  document: PortfolioDocument
  created_at: string
  updated_at: string
  published_at: string | null
}
