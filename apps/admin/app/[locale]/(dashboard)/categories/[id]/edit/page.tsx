import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import EditCategoryClient from './EditCategoryClient'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data, error } = await supabase.from('categories').select('*').eq('id', id).single()

  if (error || !data) return notFound()

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Edit Category</h1>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <EditCategoryClient category={data} />
      </div>
    </div>
  )
}
