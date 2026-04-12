import { createClient } from '@/utils/supabase/server'
import { Plus, Edit } from 'lucide-react'
import Link from 'next/link'
import { deleteProduct } from './actions'
import { DeleteButton } from '@/components/ui/DeleteButton'

export default async function ProductsPage() {
  const supabase = await createClient()

  // Joining with categories to get category names
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Products & Experiences</h1>
        <Link href="/products/new" className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm">
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Name</th>
                <th scope="col" className="px-6 py-4 font-medium">Category</th>
                <th scope="col" className="px-6 py-4 font-medium">Price</th>
                <th scope="col" className="px-6 py-4 items-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {products?.map((product) => {
                // Assuming name can be a JSON object with locales like { es: '...', en: '...' }
                const displayName = typeof product.name === 'object' ? product.name?.es || product.name?.en || 'Unnamed' : product.name
                const categoryNameObj = product.categories?.name
                const displayCategory = typeof categoryNameObj === 'object' ? categoryNameObj?.es || categoryNameObj?.en || 'Unknown' : categoryNameObj

                return (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {displayName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20">
                        {displayCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4">S/ {product.price}</td>
                    <td className="px-6 py-4 flex gap-3 items-center">
                      <Link href={`/products/${product.id}/edit`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium flex items-center gap-1">
                        <Edit className="h-4 w-4" /> Edit
                      </Link>
                      <DeleteButton id={product.id} deleteAction={deleteProduct} itemType="product" />
                    </td>
                  </tr>
                )
              })}
              {(!products || products.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
