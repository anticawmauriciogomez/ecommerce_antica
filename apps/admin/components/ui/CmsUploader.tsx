'use client'

import React, { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { X, UploadCloud, Loader2 } from 'lucide-react'

export function CmsUploader({ 
  slotKey,
  type,
  initialData
}: { 
  slotKey: string,
  type: 'single' | 'gallery',
  initialData?: any // string or string[]
}) {
  const isGallery = type === 'gallery'
  const [data, setData] = useState<any>(initialData || (isGallery ? [] : ''))
  const [isUploading, setIsUploading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsUploading(true)
    const files = Array.from(e.target.files)
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`

      const { data: uploadData, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)

      if (error) {
         continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(uploadData.path)

      if (isGallery) {
        setData((prev: string[]) => [...prev, publicUrl])
      } else {
        setData(publicUrl)
      }
    }
    
    setIsUploading(false)
  }

  const removeSingle = () => setData('')
  const removeGalleryImage = (url: string) => setData((prev: string[]) => prev.filter(g => g !== url))

  return (
    <div className="space-y-4">
      {/* Hidden inputs to capture values automatically in forms */}
      {!isGallery && <input type="hidden" name={slotKey} value={data as string} />}
      {isGallery && (data as string[]).map((url, i) => (
        <input key={i} type="hidden" name={`${slotKey}[]`} value={url} />
      ))}

      {!isGallery ? (
         <div className="group">
            {data ? (
              <div className="relative inline-block border border-(--card-border) rounded-2xl overflow-hidden shadow-sm">
                <img src={data as string} alt="Upload" className="h-48 w-auto object-cover" />
                <button type="button" onClick={removeSingle} className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-2 hover:bg-red-600 transition-all hover:scale-110 shadow-lg">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-(--card-border) rounded-2xl bg-accent-gold/[0.02] hover:bg-accent-gold/[0.05] hover:border-accent-gold/40 transition-all duration-300">
                <label className="flex flex-col items-center cursor-pointer text-accent-gold/40 hover:text-accent-gold w-full h-full justify-center group-hover:scale-105 transition-transform">
                  {isUploading ? <Loader2 className="w-10 h-10 animate-spin text-accent-gold" /> : <UploadCloud className="w-10 h-10" />}
                  <span className="mt-3 text-[10px] font-bold uppercase tracking-widest">Subir Imagen</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
                </label>
              </div>
            )}
         </div>
      ) : (
         <div className="flex flex-wrap gap-6">
            {(data as string[]).map((url, index) => (
              <div key={index} className="relative inline-block border border-(--card-border) rounded-2xl overflow-hidden shadow-sm">
                <img src={url} alt={`Gallery ${index}`} className="h-32 w-32 object-cover" />
                <button type="button" onClick={() => removeGalleryImage(url)} className="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1.5 hover:bg-red-600 transition-all hover:scale-110 shadow-lg">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <div className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-(--card-border) rounded-2xl bg-accent-gold/[0.02] hover:bg-accent-gold/[0.05] hover:border-accent-gold/40 transition-all duration-300 group">
              <label className="flex flex-col items-center cursor-pointer text-accent-gold/40 hover:text-accent-gold h-full w-full justify-center transition-transform group-hover:scale-110">
                {isUploading ? <Loader2 className="w-8 h-8 animate-spin text-accent-gold" /> : <UploadCloud className="w-8 h-8" />}
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleUpload} disabled={isUploading} />
              </label>
            </div>
         </div>
      )}

    </div>
  )
}
