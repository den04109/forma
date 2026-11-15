import { useEffect } from 'react'
import { updatePortfolio } from '@/features/portfolios/api'
import { useEditorStore } from '@/store/editorStore'

const DEBOUNCE_MS = 1000
let inFlight = false

export async function saveNow(): Promise<void> {
  if (inFlight) return
  const s = useEditorStore.getState()
  if (!s.meta || !s.doc || s.revision === s.savedRevision) return
  inFlight = true
  const revision = s.revision
  try {
    await updatePortfolio(s.meta.id, { title: s.meta.title, document: s.doc })
    useEditorStore.getState().markSaved(revision)
  } catch {
    useEditorStore.getState().setSaveStatus('error')
    inFlight = false
    return
  }
  inFlight = false
  if (useEditorStore.getState().revision !== revision) void saveNow()
}

export function useAutosave() {
  const revision = useEditorStore((s) => s.revision)

  useEffect(() => {
    const t = setTimeout(() => void saveNow(), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [revision])

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      const s = useEditorStore.getState()
      if (s.revision !== s.savedRevision) e.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => {
      window.removeEventListener('beforeunload', warn)
      void saveNow()
    }
  }, [])
}
