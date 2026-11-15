import { useState } from 'react'
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Eye, EyeOff, GripVertical, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { blockLabels, blockTypes } from '@/portfolio/blocks/defaults'
import type { Block } from '@/portfolio/types'
import { useEditorStore } from '@/store/editorStore'
import { cn } from '@/lib/utils/cn'

function Row({ block }: { block: Block }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })
  const selected = useEditorStore((s) => s.selectedId === block.id)
  const select = useEditorStore((s) => s.select)
  const toggleHidden = useEditorStore((s) => s.toggleHidden)
  const removeBlock = useEditorStore((s) => s.removeBlock)
  const label = blockLabels[block.type]
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn('flex items-center gap-1 rounded-xl border bg-white px-1.5 py-1.5',
        selected ? 'border-brand-600 ring-1 ring-brand-600' : 'border-line', isDragging && 'z-10 shadow-lg', block.hidden && 'opacity-60')}
    >
      <button {...attributes} {...listeners} aria-label={`Перетащить блок «${label}»`} className="cursor-grab touch-none rounded p-1 text-ink-muted hover:text-ink">
        <GripVertical className="h-4 w-4" aria-hidden />
      </button>
      <button onClick={() => select(block.id)} aria-pressed={selected} className="min-w-0 flex-1 truncate text-left text-sm font-medium">{label}</button>
      <button onClick={() => toggleHidden(block.id)} aria-label={block.hidden ? `Показать блок «${label}»` : `Скрыть блок «${label}»`} className="rounded p-1 text-ink-muted hover:text-ink">
        {block.hidden ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
      </button>
      <button onClick={() => removeBlock(block.id)} aria-label={`Удалить блок «${label}»`} className="rounded p-1 text-ink-muted hover:text-red-600">
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>
    </li>
  )
}

export function BlocksPanel() {
  const blocks = useEditorStore((s) => s.doc?.blocks ?? [])
  const moveBlock = useEditorStore((s) => s.moveBlock)
  const addBlock = useEditorStore((s) => s.addBlock)
  const [menu, setMenu] = useState(false)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    moveBlock(blocks.findIndex((b) => b.id === active.id), blocks.findIndex((b) => b.id === over.id))
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">Структура страницы</h2>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-1.5">{blocks.map((b) => <Row key={b.id} block={b} />)}</ul>
        </SortableContext>
      </DndContext>
      {blocks.length === 0 && <p className="text-sm text-ink-soft">Страница пуста. Добавьте первый блок.</p>}
      <div className="relative">
        <Button variant="secondary" className="w-full" aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
          <Plus className="h-4 w-4" aria-hidden />Добавить блок
        </Button>
        {menu && (
          <ul onKeyDown={(e) => e.key === 'Escape' && setMenu(false)} className="absolute inset-x-0 bottom-full z-20 mb-2 max-h-72 overflow-y-auto rounded-xl border border-line bg-white p-1 shadow-lg">
            {blockTypes.map((t) => (
              <li key={t}>
                <button onClick={() => { addBlock(t); setMenu(false) }} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-canvas">{blockLabels[t]}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
