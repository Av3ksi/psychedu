import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Erstellt einen Supabase-Client für den Browser mit den Projekt-Zugangsdaten.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}