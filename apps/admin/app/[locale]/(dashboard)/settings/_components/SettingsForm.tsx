'use client'

import React, { useState } from 'react'
import { saveAdminConfig } from '../actions'
import { Save } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SettingsForm({ configs }: { configs: any[] }) {
  const [formData, setFormData] = useState<Record<string, string>>(
    configs?.reduce((acc, curr) => ({ ...acc, [curr.id]: JSON.stringify(curr.value, null, 2) }), {}) || {}
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const parsedConfigs = Object.entries(formData).map(([id, val]) => ({
        id,
        value: JSON.parse(val)
      }))
      await saveAdminConfig(parsedConfigs)
      alert("Settings saved successfully!")
    } catch (e) {
      alert("Error parsing or saving JSON: " + String(e))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-(--card-border) mb-12">
        <div>
          <h1 className="text-4xl font-normal tracking-tight" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-serif)' }}>
            Ajustes de Administración
          </h1>
          <div className="flex items-center gap-3 mt-2">
             <div className="h-0.5 w-6 bg-accent-gold/40 rounded-full" />
             <p className="text-[10px] font-bold text-accent-gold/60 uppercase tracking-[3px]">
               Configuración técnica y parámetros globales del sistema.
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
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <div className="grid gap-12">
        <div className="rounded-3xl border border-(--card-border) bg-(--card-bg) shadow-[0_4px_20px_rgba(26,21,18,0.02)] overflow-hidden">
          <div className="border-b border-(--card-border) px-8 py-6 bg-accent-gold/[0.03]">
            <h2 className="text-xl font-normal text-(--foreground)" style={{ fontFamily: 'var(--font-serif)' }}>Configuración Global</h2>
            <p className="mt-1 text-[10px] font-bold text-accent-gold/40 uppercase tracking-widest">Parámetros directos de la base de datos</p>
          </div>
          <div className="p-8 space-y-12">
            {configs?.map((config: any) => (
              <div key={config.id} className="space-y-4">
                <label className="block text-[10px] font-bold text-accent-gold/60 uppercase tracking-widest px-1">
                  {config.key}
                </label>
                <div className="flex rounded-2xl shadow-[0_2px_10px_rgba(26,21,18,0.01)] overflow-hidden border border-(--card-border)">
                  <span className="inline-flex items-center border-r border-(--card-border) bg-(--background) px-4 text-[9px] font-bold text-accent-gold/60 uppercase tracking-widest">
                    JSON
                  </span>
                  <textarea
                    value={formData[config.id]}
                    onChange={(e) => setFormData(prev => ({ ...prev, [config.id]: e.target.value }))}
                    rows={4}
                    className="block w-full border-0 py-4 px-5 text-(--foreground) bg-(--background)/30 placeholder:text-accent-gold/20 focus:ring-0 sm:text-sm font-mono leading-relaxed"
                  />
                </div>
                {config.description && (
                  <p className="text-[10px] text-accent-gold/40 px-2 italic font-medium">{config.description}</p>
                )}
              </div>
            ))}
            {(!configs || configs.length === 0) && (
              <div className="text-center py-20 rounded-2xl border border-dashed border-accent-gold/10 bg-accent-gold/[0.01]">
                <p className="text-lg text-accent-gold/40 italic font-medium" style={{ fontFamily: 'var(--font-serif)' }}>No se encontraron configuraciones en la base de datos.</p>
              </div>
            )}
          </div>
        </div>
      </div>



    </>
  )
}
