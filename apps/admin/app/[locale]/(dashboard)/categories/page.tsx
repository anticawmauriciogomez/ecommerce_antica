import { createClient } from '@/utils/supabase/server'
import { Plus, Edit } from 'lucide-react'
import Link from 'next/link'
import { deleteCategory } from './actions'
import { DeleteButton } from '@/components/ui/DeleteButton'

export default async function CategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-normal tracking-tight" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-serif)' }}>
            Categorías
          </h1>
          <div className="flex items-center gap-3 mt-1">
             <div className="h-0.5 w-6 bg-accent-gold/40 rounded-full" />
             <p className="text-[10px] font-bold text-accent-gold/60 uppercase tracking-[2px]">
               Organización del catálogo de productos
             </p>
          </div>
        </div>
        <Link 
          href="/categories/new" 
          className="flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-accent-gold/20 transition-all duration-300 hover:scale-[1.02]"
          style={{ backgroundColor: '#cba87c' }}
        >
          <Plus className="h-4 w-4" />
          Añadir Categoría
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-(--card-border) bg-(--card-bg) shadow-[0_4px_20px_rgba(26,21,18,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent-gold/[0.03] text-[10px] font-bold uppercase tracking-widest text-accent-gold/60 border-b border-(--card-border)">
              <tr>
                <th scope="col" className="px-8 py-6">Nombre</th>
                <th scope="col" className="px-8 py-6">Fecha de Creación</th>
                <th scope="col" className="px-8 py-6">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--card-border)">
              {categories?.map((cat) => {
                const displayName = typeof cat.name === 'object' ? cat.name?.es || cat.name?.en || 'Unnamed' : cat.name
                
                return (
                  <tr key={cat.id} className="hover:bg-accent-gold/[0.01] transition-colors group">
                    <td className="px-8 py-6 font-medium text-(--foreground)">
                      {displayName}
                    </td>
                    <td className="px-8 py-6 text-accent-gold/50 text-[10px] font-bold uppercase tracking-wider">
                      {new Date(cat.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-6 items-center">
                        <Link 
                          href={`/categories/${cat.id}/edit`} 
                          className="text-accent-gold/70 hover:text-accent-gold font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105"
                        >
                          <Edit className="h-3.5 w-3.5" /> Editar
                        </Link>
                        <DeleteButton id={cat.id.toString()} deleteAction={async (id) => {
                          'use server';
                          await deleteCategory(id)
                        }} itemType="categoría" />
                      </div>
                    </td>
                  </tr>
                )
              })}

              {(!categories || categories.length === 0) && (
                <tr>
                  <td colSpan={3} className="px-8 py-16 text-center text-accent-gold/40 italic font-medium" style={{ fontFamily: 'var(--font-serif)' }}>
                    No se encontraron categorías
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
