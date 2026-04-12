'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import { saveCategory } from '../actions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CategoryForm({ category, onClose }: { category?: any, onClose: () => void }) {
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    if (category?.id) {
      formData.append('id', category.id)
    }
    
    try {
      await saveCategory(formData)
      onClose()
    } catch (error) {
      alert("Error saving category: " + String(error))
    } finally {
      setIsPending(false)
    }
  }

  const nameEs = category?.name?.es || ''
  const nameEn = category?.name?.en || ''

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name_es">Name (ES)</Label>
            <Input id="name_es" name="name_es" defaultValue={nameEs} required />
          </div>
          <div className="space-y-2">
              <Label htmlFor="name_en">Name (EN)</Label>
              <Input id="name_en" name="name_en" defaultValue={nameEn} required />
          </div>
        </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save Category'}</Button>
      </div>
    </form>
  )
}
