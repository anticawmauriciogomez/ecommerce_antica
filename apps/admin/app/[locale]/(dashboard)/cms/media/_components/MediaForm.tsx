'use client'

import React, { useState } from 'react'
import { Save } from 'lucide-react'
import { saveStorefrontContent } from '../../actions'
import { CmsUploader } from '@/components/ui/CmsUploader'

type MediaSlot = { key: string; label: string; type: string }
type MediaGroup = { group: string; items: MediaSlot[] }

export function MediaForm({
  mediaSlots,
  initialRegistry,
}: {
  mediaSlots: MediaGroup[]
  initialRegistry: Record<string, unknown>
}) {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const formData = new FormData(e.currentTarget)
      const payload: Record<string, unknown> = {}

      mediaSlots.forEach((group) => {
        group.items.forEach((item) => {
          if (item.type === 'gallery') {
            payload[item.key] = formData.getAll(`${item.key}[]`)
          } else {
            payload[item.key] = formData.get(item.key)
          }
        })
      })

      await saveStorefrontContent('media_registry', payload)
      alert('¡Media guardado! Los cambios están en vivo en la tienda.')
    } catch (error) {
      alert('Error al guardar media: ' + String(error))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-(--card-border)">
        <div>
          <h1 className="text-4xl font-normal tracking-tight" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-serif)' }}>
            Galería Media Storefront
          </h1>
          <div className="flex items-center gap-3 mt-2">
             <div className="h-0.5 w-6 bg-accent-gold/40 rounded-full" />
             <p className="text-[10px] font-bold text-accent-gold/60 uppercase tracking-[3px]">
               Gestiona todas las imágenes del sitio web con precisión.
             </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center gap-3 rounded-xl px-8 py-3 text-sm font-bold text-white shadow-xl shadow-accent-gold/20 transition-all duration-300 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: '#cba87c' }}
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Guardando...' : 'Guardar Media'}
        </button>
      </div>

      <div className="space-y-12">
        {mediaSlots.map((group, gIdx) => (
          <div
            key={gIdx}
            className="rounded-3xl shadow-[0_4px_20px_rgba(26,21,18,0.02)] border border-(--card-border) bg-(--card-bg) overflow-hidden"
          >
            <div className="px-8 py-5 bg-accent-gold/[0.03] border-b border-(--card-border)">
              <h2 className="text-xl font-normal text-(--foreground)" style={{ fontFamily: 'var(--font-serif)' }}>
                {group.group}
              </h2>
            </div>

            <div className="p-8 space-y-12">
              {group.items.map((item) => (
                <div
                  key={item.key}
                  className="space-y-4 pb-12 border-b border-dashed border-(--card-border) last:border-0 last:pb-0"
                >
                  <label className="block text-[10px] font-bold text-accent-gold/60 uppercase tracking-widest">
                    {item.label}{' '}
                    <span className="text-[9px] font-bold text-accent-gold/30 font-mono ml-2 lowercase px-1.5 py-0.5 rounded-full bg-accent-gold/[0.03]">
                      #{item.key}
                    </span>
                  </label>

                  <div className="rounded-2xl border border-(--card-border) bg-(--background) p-3 transition-all hover:border-accent-gold/20">
                    <CmsUploader
                      slotKey={item.key}
                      type={item.type as 'single' | 'gallery'}
                      initialData={initialRegistry[item.key]}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {mediaSlots.length === 0 && (
          <div className="text-center py-24 rounded-3xl border border-dashed border-accent-gold/20 bg-(--card-bg)">
            <p className="text-xl text-accent-gold/40 italic" style={{ fontFamily: 'var(--font-serif)' }}>No hay slots de media definidos.</p>
            <p className="text-[10px] mt-4 uppercase tracking-[3px] text-accent-gold/30 font-bold">
              Ejecuta <code className="bg-accent-gold/10 px-2 py-1 rounded text-accent-gold ml-2">npm run cms:sync</code>
            </p>
          </div>
        )}
      </div>

    </form>


  )
}
