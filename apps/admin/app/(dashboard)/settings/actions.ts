'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveAdminConfig(configsToSave: { id: string, value: any }[]) {
  const supabase = await createClient()

  for (const config of configsToSave) {
    const { error } = await supabase
      .from('admin_config')
      .update({ value: config.value })
      .eq('id', config.id)

    if (error) {
      throw new Error(`Failed to save config: ${error.message}`)
    }
  }

  revalidatePath('/settings')
}
