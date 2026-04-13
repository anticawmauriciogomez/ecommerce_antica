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
    <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name_es" className="text-[10px] font-bold uppercase tracking-widest text-accent-gold/60 px-1">Nombre (ES)</Label>
            <Input id="name_es" name="name_es" defaultValue={nameEs} required className="rounded-xl border-(--card-border) bg-(--background)" />
          </div>
          <div className="space-y-2">
              <Label htmlFor="name_en" className="text-[10px] font-bold uppercase tracking-widest text-accent-gold/60 px-1">Nombre (EN)</Label>
              <Input id="name_en" name="name_en" defaultValue={nameEn} required className="rounded-xl border-(--card-border) bg-(--background)" />
          </div>
        </div>

      <div className="flex justify-end gap-6 pt-8 border-t border-(--card-border)">

        <button 
          type="button" 
          onClick={onClose}
          className="px-6 py-2.5 text-[10px] font-bold text-accent-gold/40 uppercase tracking-widest hover:text-accent-gold transition-colors"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={isPending}
          className="rounded-xl px-10 py-3 text-sm font-bold text-white shadow-xl shadow-accent-gold/20 transition-all duration-300 disabled:opacity-50 hover:scale-[1.02]"
          style={{ backgroundColor: '#cba87c' }}
        >

          {isPending ? 'Guardando...' : 'Guardar Categoría'}
        </button>
      </div>
    </form>

  )
}
