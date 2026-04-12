'use client'

import React, { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { X, UploadCloud, Loader2 } from 'lucide-react'

// Expects mainImage (string) and galleryImages (string[]) from existing product.
// Puts urls into hidden inputs with name "image_url" and "image_gallery" so the parent FormData catches them.
export function ImageUploader({ 
  initialPrimary = '', 
  initialGallery = [] 
}: { 
  initialPrimary?: string | null, 
  initialGallery?: string[] 
}) {
  const [primary, setPrimary] = useState<string>(initialPrimary || '')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gallery, setGallery] = useState<string[]>(initialGallery || [])
  const [isUploading, setIsUploading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isPrimary: boolean) => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsUploading(true)
    const files = Array.from(e.target.files)
    
    // We iterate over uploaded files
    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (error) {
        console.error('Error uploading image', error)
        alert('Error uploading image')
        continue
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path)

      if (isPrimary && files.length === 1) {
        setPrimary(publicUrl)
      } else {
        setGallery(prev => [...prev, publicUrl])
      }
    }
    
    setIsUploading(false)
  }

  const removePrimary = () => setPrimary('')
  const removeGalleryImage = (url: string) => setGallery(prev => prev.filter(g => g !== url))

  return (
    <div className="space-y-6">
      <input type="hidden" name="image_url" value={primary} />
      {gallery.map((url, i) => (
        <input key={i} type="hidden" name="image_gallery" value={url} />
      ))}

      {/* Primary Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Main Product Image (Thumbnail)</label>
        {primary ? (
          <div className="relative inline-block border rounded-md overflow-hidden dark:border-gray-700">
            <img src={primary} alt="Primary" className="h-32 w-32 object-cover" />
            <button
              type="button"
              onClick={removePrimary}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
            <label className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-indigo-600 transition-colors">
              {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
              <span className="mt-2 text-sm font-medium">Upload Main Image</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, true)} disabled={isUploading} />
            </label>
          </div>
        )}
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gallery Images (Multiple)</label>
        <div className="flex flex-wrap gap-4">
          {gallery.map((url, index) => (
            <div key={index} className="relative inline-block border rounded-md overflow-hidden dark:border-gray-700">
              <img src={url} alt={`Gallery ${index}`} className="h-24 w-24 object-cover" />
              <button
                type="button"
                onClick={() => removeGalleryImage(url)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          
          <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
            <label className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-indigo-600 transition-colors h-full w-full justify-center">
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
              <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleUpload(e, false)} disabled={isUploading} />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
