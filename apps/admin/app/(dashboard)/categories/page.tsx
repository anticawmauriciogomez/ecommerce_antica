import { createClient } from '@/utils/supabase/server'
import { Plus, Edit } from 'lucide-react'
import Link from 'next/link'
import { deleteCategory } from './actions'
import { DeleteButton } from '@/components/ui/DeleteButton'

export default async function CategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Categories</h1>
        <Link href="/categories/new" className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm">
          <Plus className="h-4 w-4" />
          Add Category
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Name</th>
                <th scope="col" className="px-6 py-4 font-medium">Created At</th>
                <th scope="col" className="px-6 py-4 items-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {categories?.map((cat) => {
                const displayName = typeof cat.name === 'object' ? cat.name?.es || cat.name?.en || 'Unnamed' : cat.name
                
                return (
                  <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {displayName}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(cat.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex gap-3 items-center">
                      <Link href={`/categories/${cat.id}/edit`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium flex items-center gap-1">
                        <Edit className="h-4 w-4" /> Edit
                      </Link>
                      <DeleteButton id={cat.id.toString()} deleteAction={async (id) => {
                        'use server';
                        await deleteCategory(id)
                      }} itemType="category" />
                    </td>
                  </tr>
                )
              })}
              {(!categories || categories.length === 0) && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No categories found
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
