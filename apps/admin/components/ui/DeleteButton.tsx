'use client'

import { Trash2 } from 'lucide-react'
import { useTransition } from 'react'

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
        if (confirm(`Are you sure you want to delete this ${itemType}?`)) {
          startTransition(async () => {
            try {
              await deleteAction(id)
            } catch (error) {
              alert(`Error deleting ${itemType}: ${error}`)
            }
          })
        }
      }}
      disabled={isPending}
      className="text-red-500 hover:text-red-700 font-medium flex items-center gap-1 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" /> {isPending ? 'Deleting...' : 'Delete'}
    </button>
  )
}
