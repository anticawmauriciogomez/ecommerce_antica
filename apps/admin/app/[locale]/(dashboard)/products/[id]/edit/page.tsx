import { createClient } from '@/utils/supabase/server'
import { getCurrency } from '@/utils/currency'
import { ProductForm } from '../../_components/ProductForm'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const currency = await getCurrency()
  
  const [productRes, categoriesRes] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('*')
  ])

  if (productRes.error || !productRes.data) return notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Edit Product</h1>
      <ProductForm product={productRes.data} categories={categoriesRes.data || []} currency={currency} />
    </div>
  )
}
