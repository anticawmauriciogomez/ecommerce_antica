import { createClient } from '@/utils/supabase/server'
import { ProductForm } from '../_components/ProductForm'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Create Product</h1>
      <ProductForm categories={categories || []} />
    </div>
  )
}
