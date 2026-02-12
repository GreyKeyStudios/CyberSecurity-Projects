import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

const noopUnsubscribe = { unsubscribe: () => {} }

function createStubClient(): SupabaseClient {
  const stub = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: noopUnsubscribe } }),
      signOut: () => Promise.resolve({ error: null }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
    },
    from: (_table: string) => ({
      select: () => ({ order: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }) }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }),
    }),
  }
  return stub as unknown as SupabaseClient
}

export function createClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return createStubClient()
  }
  return createBrowserClient(url, key)
}
