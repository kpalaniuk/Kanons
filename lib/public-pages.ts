import { createClient } from '@supabase/supabase-js'

// Uses anon key for reads (public), service role key for writes (admin API routes)
function getAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export interface PublicPage {
  id: string
  slug: string
  title: string
  href: string
  enabled: boolean
  created_at: string
  updated_at: string
}

/** Check if a slug is publicly enabled (used by the /view/[slug] route) */
export async function isPagePublic(slug: string): Promise<boolean> {
  try {
    const { data } = await getAnonClient()
      .from('public_pages')
      .select('enabled')
      .eq('slug', slug)
      .single()
    return data?.enabled === true
  } catch {
    return false
  }
}

/** Get all public pages (used by admin KB toggle UI) */
export async function getPublicPages(): Promise<PublicPage[]> {
  try {
    const { data } = await getAnonClient()
      .from('public_pages')
      .select('*')
      .order('created_at', { ascending: false })
    return data || []
  } catch {
    return []
  }
}

/** Toggle a page public/private. Creates the row if it doesn't exist. */
export async function setPagePublic(
  slug: string,
  title: string,
  href: string,
  enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await getAdminClient()
      .from('public_pages')
      .upsert(
        { slug, title, href, enabled, updated_at: new Date().toISOString() },
        { onConflict: 'slug' }
      )
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: String(e) }
  }
}
