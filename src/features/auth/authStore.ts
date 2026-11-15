import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  init: () => Promise<void>
  signOut: () => Promise<void>
}

let initialized = false

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  init: async () => {
    if (initialized) return
    initialized = true
    if (!isSupabaseConfigured) return set({ loading: false })
    const { data } = await supabase.auth.getSession()
    set({ session: data.session, user: data.session?.user ?? null, loading: false })
    supabase.auth.onAuthStateChange((_event, session) =>
      set({ session, user: session?.user ?? null, loading: false }),
    )
  },
  signOut: async () => {
    await supabase.auth.signOut()
    set({ session: null, user: null })
  },
}))
