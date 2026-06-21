'use client'

import { Trash2 } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from "@repo/ui/toast"

export function DeleteButton({ 
  id, 
  deleteAction, 
  itemType 
}: { 
  id: string, 
  deleteAction: (id: string) => Promise<void>,
  itemType: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <button 
      onClick={() => {
        if (confirm(`¿Estás seguro de que deseas eliminar este ${itemType}?`)) {
          startTransition(async () => {
            try {
              await deleteAction(id)
            } catch (error) {
              toast.error(`Error al eliminar: ${error}`)
            }
          })
        }
      }}
      disabled={isPending}
      className="text-red-400 hover:text-red-600 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" /> {isPending ? 'Eliminando...' : 'Eliminar'}
    </button>

  )
}
