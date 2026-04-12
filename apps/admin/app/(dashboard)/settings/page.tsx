import { createClient } from '@/utils/supabase/server'
import { SettingsForm } from './_components/SettingsForm'

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: configs } = await supabase
    .from('admin_config')
    .select('*')
    .order('key', { ascending: true })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <SettingsForm configs={configs || []} />
    </div>
  )
}
