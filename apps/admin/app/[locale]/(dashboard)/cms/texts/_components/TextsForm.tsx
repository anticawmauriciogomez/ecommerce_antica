'use client'

import React, { useState } from 'react'
import { Save, ChevronDown, ChevronRight } from 'lucide-react'
import { saveStorefrontContent } from '../../actions'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import { toast } from "@repo/ui/toast"

// Aplana objeto anidado: { Hero: { title: "x" } } -> { "Hero.title": "x" }
function flattenObj(obj: any, parent = '', res: Record<string, string> = {}) {
  for (const key in obj) {
    const propName = parent ? `${parent}.${key}` : key
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      flattenObj(obj[key], propName, res)
    } else {
      res[propName] = String(obj[key] ?? '')
    }
  }
  return res
}

// Desaplana: { "Hero.title": "x" } -> { Hero: { title: "x" } }
function unflattenObj(flat: Record<string, string>) {
  const result: any = {}
  for (const flatKey in flat) {
    const keys = flatKey.split('.')
    let cur = result
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (!key) continue

      if (i === keys.length - 1) {
        cur[key] = flat[flatKey]
      } else {
        if (!cur[key]) cur[key] = {}
        cur = cur[key]
      }
    }
  }
  return result
}

// Detecta si un texto es largo (más de 80 chars o contiene saltos de línea)
function isLongText(val: string) {
  return val.length > 80 || val.includes('\n')
}

interface TextsFormProps {
  baseDictionaryEs: Record<string, unknown>
  baseDictionaryEn: Record<string, unknown>
  savedTranslations: Record<string, unknown>
}

export function TextsForm({ baseDictionaryEs, baseDictionaryEn, savedTranslations }: TextsFormProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  // Valores actuales: merged base + saved overrides
  const flatEs = flattenObj(baseDictionaryEs)
  const flatEn = flattenObj(baseDictionaryEn)
  const flatSaved = flattenObj(savedTranslations as Record<string, unknown>)

  // Estado editable separado por idioma
  const [valuesEs, setValuesEs] = useState<Record<string, string>>(() => ({
    ...flatEs,
    ...Object.fromEntries(
      Object.entries(flatSaved)
        .filter(([k]) => k.startsWith('es.') || !k.includes('.'))
        .map(([k, v]) => [k.replace(/^es\./, ''), v])
    )
  }))

  const [valuesEn, setValuesEn] = useState<Record<string, string>>(() => ({
    ...flatEn,
    ...Object.fromEntries(
      Object.entries(flatSaved)
        .filter(([k]) => k.startsWith('en.'))
        .map(([k, v]) => [k.replace(/^en\./, ''), v])
    )
  }))

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const esNested = unflattenObj(valuesEs)
      const enNested = unflattenObj(valuesEn)
      await saveStorefrontContent('translations', { es: esNested, en: enNested })
      toast.success('¡Textos guardados! Los cambios están en vivo.')
    } catch (err) {
      toast.error('Error al guardar los textos')
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  // Agrupar por sección (primera parte de la clave) - aseguramos que sea string[]
  const sections = [...new Set(Object.keys(flatEs).map(k => k.split('.')[0]))].filter(Boolean) as string[]

  return (
    <div className="space-y-12">
      <div className="sticky -top-8 md:-top-12 z-20 bg-(--background)/95 backdrop-blur-md pt-8 md:pt-12 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-(--card-border)">
        <div>
          <h1 className="text-4xl font-normal tracking-tight" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-serif)' }}>
            Textos del Storefront
          </h1>
          <div className="flex items-center gap-3 mt-2">
             <div className="h-0.5 w-6 bg-accent-gold/40 rounded-full" />
             <p className="text-[10px] font-bold text-accent-gold/60 uppercase tracking-[3px]">
               Edita todos los textos del sitio en Español e Inglés con precisión.
             </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-3 rounded-xl px-8 py-3 text-sm font-bold text-white shadow-xl shadow-accent-gold/20 transition-all duration-300 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: '#cba87c' }}
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Guardando...' : 'Guardar Textos'}
        </button>
      </div>

      <div className="space-y-6">
        {sections.map((section) => {
          const sectionKeys = Object.keys(flatEs).filter(k => k.startsWith(`${section}.`))
          const isOpen = openSections[section] ?? false

          return (
            <div
              key={section}
              className="rounded-3xl shadow-[0_4px_20px_rgba(26,21,18,0.02)] border border-(--card-border) bg-(--card-bg) overflow-hidden transition-all duration-500"
            >
              <button
                type="button"
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between px-8 py-6 bg-accent-gold/[0.03] hover:bg-accent-gold/[0.06] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-1.5 w-1.5 rounded-full bg-accent-gold transition-all duration-500 ${isOpen ? 'scale-150 rotate-45' : ''}`} />
                  <h2 className="text-xl font-normal text-(--foreground)" style={{ fontFamily: 'var(--font-serif)' }}>
                    {section}
                  </h2>
                </div>
                {isOpen
                  ? <ChevronDown className="h-5 w-5 text-accent-gold" />
                  : <ChevronRight className="h-5 w-5 text-accent-gold" />
                }
              </button>

              {isOpen && (
                <div className="p-8 space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
                  {sectionKeys.map((flatKey) => {
                    const esVal = valuesEs[flatKey] ?? ''
                    const enVal = valuesEn[flatKey] ?? flatEn[flatKey] ?? ''
                    const long = isLongText(esVal) || isLongText(enVal)

                    return (
                      <div key={flatKey} className="border-b border-dashed border-(--card-border) pb-12 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-6">
                           <span className="text-[9px] font-bold text-accent-gold/40 font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent-gold/[0.05] border border-accent-gold/10">
                              {flatKey}
                           </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          {/* Español */}
                          <div className="space-y-3">
                            <label className="block text-[10px] font-bold text-accent-gold/60 uppercase tracking-[2px] px-1">
                              Español
                            </label>
                            {long ? (
                              <RichTextEditor
                                defaultValue={esVal}
                                onChange={(html) => setValuesEs(prev => ({ ...prev, [flatKey]: html }))}
                              />
                            ) : (
                              <input
                                type="text"
                                value={esVal}
                                onChange={(e) => {
                                  const val = e.target.value
                                  setValuesEs(prev => {
                                    const next = { ...prev }
                                    next[flatKey] = val
                                    return next
                                  })
                                }}
                                className="w-full rounded-2xl border border-(--card-border) bg-(--background) px-5 py-4 text-sm text-(--foreground) focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold transition-all font-medium"
                              />
                            )}
                          </div>
                          {/* English */}
                          <div className="space-y-3">
                            <label className="block text-[10px] font-bold text-accent-gold/60 uppercase tracking-[2px] px-1">
                              English
                            </label>
                            {long ? (
                              <RichTextEditor
                                defaultValue={enVal}
                                onChange={(html) => setValuesEn(prev => ({ ...prev, [flatKey]: html }))}
                              />
                            ) : (
                              <input
                                type="text"
                                value={enVal}
                                onChange={(e) => {
                                  const val = e.target.value
                                  setValuesEn(prev => {
                                    const next = { ...prev }
                                    next[flatKey] = val
                                    return next
                                  })
                                }}
                                className="w-full rounded-2xl border border-(--card-border) bg-(--background) px-5 py-4 text-sm text-(--foreground) focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold transition-all font-medium"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}
