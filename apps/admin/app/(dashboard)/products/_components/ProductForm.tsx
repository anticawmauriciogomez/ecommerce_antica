'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import { saveProduct } from '../actions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductForm({ product, categories }: { product?: any, categories: any[] }) {
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    if (product?.id) {
      formData.append('id', product.id)
    }
    
    try {
      await saveProduct(formData)
    } catch (error) {
      alert("Error saving product: " + String(error))
      setIsPending(false)
    }
  }

  const nameEs = product?.name?.es || ''
  const nameEn = product?.name?.en || ''
  const descEs = product?.description?.es || ''
  const descEn = product?.description?.en || ''

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Details */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4 shadow-sm">
            <h2 className="font-semibold text-lg dark:text-white">Basic Information</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name_es">Name (ES)</Label>
                <Input id="name_es" name="name_es" defaultValue={nameEs} required />
              </div>
              <div className="space-y-2">
                 <Label htmlFor="name_en">Name (EN)</Label>
                 <Input id="name_en" name="name_en" defaultValue={nameEn} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (S/.)</Label>
                <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price || ''} required />
              </div>
              <div className="space-y-2">
                 <Label htmlFor="category_id">Category</Label>
                 <select 
                    id="category_id" 
                    name="category_id" 
                    defaultValue={product?.category_id || ''} 
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:border-gray-700 dark:text-gray-50 [&>option]:text-gray-900"
                  >
                    <option value="" disabled>Select a category...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name?.es || c.name?.en || 'Unnamed'}
                      </option>
                    ))}
                 </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Description (ES)</Label>
                <RichTextEditor name="description_es" defaultValue={descEs} />
              </div>
              <div className="space-y-2">
                 <Label>Description (EN)</Label>
                 <RichTextEditor name="description_en" defaultValue={descEn} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Media */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-lg dark:text-white">Media</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Upload product images directly to Supabase Storage.</p>
            <ImageUploader 
              initialPrimary={product?.image_url} 
              initialGallery={product?.image_gallery || []} 
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save Product'}</Button>
      </div>
    </form>
  )
}
