import { create } from 'zustand'
import { arrayMove } from '@dnd-kit/sortable'
import { createBlock } from '@/portfolio/blocks/defaults'
import type { BlockType, Portfolio, PortfolioDocument, PortfolioStatus, TemplateId } from '@/portfolio/types'

const HISTORY_LIMIT = 50
const COALESCE_MS = 800

export type SaveStatus = 'saved' | 'saving' | 'error'

interface Meta { id: string; title: string; templateId: TemplateId; status: PortfolioStatus; slug: string | null }

interface EditorState {
  meta: Meta | null
  doc: PortfolioDocument | null
  selectedId: string | null
  past: PortfolioDocument[]
  future: PortfolioDocument[]
  lastKey: string | null
  lastAt: number
  revision: number
  savedRevision: number
  saveStatus: SaveStatus
  load: (p: Portfolio) => void
  update: (fn: (doc: PortfolioDocument) => PortfolioDocument, coalesceKey?: string) => void
  setTitle: (title: string) => void
  undo: () => void
  redo: () => void
  select: (id: string | null) => void
  addBlock: (type: BlockType) => void
  removeBlock: (id: string) => void
  toggleHidden: (id: string) => void
  moveBlock: (from: number, to: number) => void
  markSaved: (revision: number) => void
  setSaveStatus: (s: SaveStatus) => void
  setPublication: (status: PortfolioStatus, slug: string | null) => void
}

const keepSelection = (doc: PortfolioDocument, id: string | null) =>
  id && doc.blocks.some((b) => b.id === id) ? id : null

export const useEditorStore = create<EditorState>((set, get) => ({
  meta: null, doc: null, selectedId: null, past: [], future: [],
  lastKey: null, lastAt: 0, revision: 0, savedRevision: 0, saveStatus: 'saved',

  load: (p) => set({
    meta: { id: p.id, title: p.title, templateId: p.template_id, status: p.status, slug: p.slug },
    doc: p.document, selectedId: null, past: [], future: [], lastKey: null, lastAt: 0,
    revision: 0, savedRevision: 0, saveStatus: 'saved',
  }),

  update: (fn, coalesceKey) => set((s) => {
    if (!s.doc) return s
    const next = fn(s.doc)
    if (next === s.doc) return s
    const coalesce = coalesceKey !== undefined && coalesceKey === s.lastKey && Date.now() - s.lastAt < COALESCE_MS
    return {
      doc: next,
      past: coalesce ? s.past : [...s.past, s.doc].slice(-HISTORY_LIMIT),
      future: [], lastKey: coalesceKey ?? null, lastAt: Date.now(),
      revision: s.revision + 1, saveStatus: 'saving',
    }
  }),

  setTitle: (title) => set((s) => (s.meta ? { meta: { ...s.meta, title }, revision: s.revision + 1, saveStatus: 'saving' } : s)),

  undo: () => set((s) => {
    const prev = s.past[s.past.length - 1]
    if (!prev || !s.doc) return s
    return { doc: prev, past: s.past.slice(0, -1), future: [s.doc, ...s.future], lastKey: null,
      selectedId: keepSelection(prev, s.selectedId), revision: s.revision + 1, saveStatus: 'saving' }
  }),

  redo: () => set((s) => {
    const [next, ...rest] = s.future
    if (!next || !s.doc) return s
    return { doc: next, past: [...s.past, s.doc], future: rest, lastKey: null,
      selectedId: keepSelection(next, s.selectedId), revision: s.revision + 1, saveStatus: 'saving' }
  }),

  select: (id) => set({ selectedId: id }),

  addBlock: (type) => {
    const block = createBlock(type)
    get().update((d) => ({ ...d, blocks: [...d.blocks, block] }))
    set({ selectedId: block.id })
  },

  removeBlock: (id) => {
    get().update((d) => ({ ...d, blocks: d.blocks.filter((b) => b.id !== id) }))
    if (get().selectedId === id) set({ selectedId: null })
  },

  toggleHidden: (id) =>
    get().update((d) => ({ ...d, blocks: d.blocks.map((b) => (b.id === id ? { ...b, hidden: !b.hidden } : b)) })),

  moveBlock: (from, to) =>
    get().update((d) => (from === to ? d : { ...d, blocks: arrayMove(d.blocks, from, to) })),

  markSaved: (revision) => set((s) => ({ savedRevision: revision, saveStatus: s.revision === revision ? 'saved' : 'saving' })),
  setSaveStatus: (saveStatus) => set({ saveStatus }),
  setPublication: (status, slug) => set((s) => (s.meta ? { meta: { ...s.meta, status, slug } } : s)),
}))
