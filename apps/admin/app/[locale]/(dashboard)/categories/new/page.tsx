'use client'

import { CategoryForm } from '../_components/CategoryForm'
import { useRouter } from 'next/navigation'

export default function NewCategoryPage() {
  const router = useRouter()
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Create Category</h1>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <CategoryForm onClose={() => router.push('/categories')} />
      </div>
    </div>
  )
}
