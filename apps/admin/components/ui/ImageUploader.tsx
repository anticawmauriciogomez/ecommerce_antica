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
        <label className="block text-[10px] font-bold text-accent-gold/60 uppercase tracking-widest px-1 mb-3">Imagen Principal (Miniatura)</label>
        {primary ? (
          <div className="relative inline-block border border-(--card-border) rounded-2xl overflow-hidden shadow-sm">
            <img src={primary} alt="Primary" className="h-40 w-40 object-cover" />
            <button
              type="button"
              onClick={removePrimary}
              className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-2 hover:bg-red-600 transition-all hover:scale-110 shadow-lg"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-(--card-border) rounded-2xl bg-accent-gold/[0.02] hover:bg-accent-gold/[0.05] hover:border-accent-gold/40 transition-all duration-300 group">
            <label className="flex flex-col items-center cursor-pointer text-accent-gold/40 hover:text-accent-gold transition-transform group-hover:scale-105">
              {isUploading ? <Loader2 className="w-8 h-8 animate-spin text-accent-gold" /> : <UploadCloud className="w-8 h-8" />}
              <span className="mt-3 text-[10px] font-bold uppercase tracking-widest">Subir Imagen Principal</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, true)} disabled={isUploading} />
            </label>
          </div>
        )}
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block text-[10px] font-bold text-accent-gold/60 uppercase tracking-widest px-1 mb-3">Galería de Imágenes (Múltiples)</label>
        <div className="flex flex-wrap gap-4">
          {gallery.map((url, index) => (
            <div key={index} className="relative inline-block border border-(--card-border) rounded-2xl overflow-hidden shadow-sm">
              <img src={url} alt={`Gallery ${index}`} className="h-24 w-24 object-cover" />
              <button
                type="button"
                onClick={() => removeGalleryImage(url)}
                className="absolute top-1.5 right-1.5 bg-red-500/90 text-white rounded-full p-1.5 hover:bg-red-600 transition-all hover:scale-110 shadow-lg"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          
          <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-(--card-border) rounded-2xl bg-accent-gold/[0.02] hover:bg-accent-gold/[0.05] hover:border-accent-gold/40 transition-all duration-300 group">
            <label className="flex flex-col items-center cursor-pointer text-accent-gold/40 hover:text-accent-gold h-full w-full justify-center transition-transform group-hover:scale-110">
              {isUploading ? <Loader2 className="w-6 h-6 animate-spin text-accent-gold" /> : <UploadCloud className="w-6 h-6" />}
              <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleUpload(e, false)} disabled={isUploading} />
            </label>
          </div>
        </div>
      </div>

    </div>
  )
}
