'use client'

import { CategoryForm } from '../../_components/CategoryForm'
import { useRouter } from 'next/navigation'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EditCategoryClient({ category }: { category: any }) {
  const router = useRouter()
  return <CategoryForm category={category} onClose={() => router.push('/categories')} />
}
