'use server'

import { createClient } from '@/utils/supabase/server'

const TABLE = 'storefront_content'

/**
 * Obtiene un campo (translations o media_registry) de la tabla storefront_content.
 * Cada campo es una fila con su ID correspondiente.
 */
export async function getStorefrontContent(field: 'translations' | 'media_registry') {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE)
    .select('content')
    .eq('id', field)
    .single()

  if (error || !data) return {}
  return (data as any).content ?? {}
}

/**
 * Guarda (upsert) un campo en la tabla storefront_content.
 */
export async function saveStorefrontContent(
  field: 'translations' | 'media_registry',
  payload: Record<string, unknown>
) {
  const supabase = await createClient()
  
  // Obtenemos lo que ya existe en esa fila específica
  const { data: existing } = await supabase
    .from(TABLE)
    .select('content')
    .eq('id', field)
    .single()

  const currentData = existing ? (existing as any).content ?? {} : {}
  const merged = { ...currentData, ...payload }

  const { error } = await supabase
    .from(TABLE)
    .upsert(
      { id: field, content: merged, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    )

  if (error) throw new Error(error.message)
  return { success: true }
}



