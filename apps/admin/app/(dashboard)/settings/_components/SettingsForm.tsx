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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Settings</h1>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid gap-6">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Global Configuration</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage application-wide settings and parameters.</p>
          </div>
          <div className="p-6 space-y-6">
            {configs?.map((config: any) => (
              <div key={config.id} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {config.key}
                </label>
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm dark:border-gray-700 dark:bg-gray-800">
                    JSON
                  </span>
                  <textarea
                    value={formData[config.id]}
                    onChange={(e) => setFormData(prev => ({ ...prev, [config.id]: e.target.value }))}
                    rows={4}
                    className="block w-full rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-950 dark:text-gray-200 dark:ring-gray-700 font-mono"
                  />
                </div>
                {config.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{config.description}</p>
                )}
              </div>
            ))}
            {(!configs || configs.length === 0) && (
              <p className="text-sm text-gray-500 dark:text-gray-400">No settings found in the database. Add keys in the `admin_config` table.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
