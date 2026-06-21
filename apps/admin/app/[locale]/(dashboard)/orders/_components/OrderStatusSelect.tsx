'use client'

import { useState } from 'react'
import { updateOrderStatus } from '../actions'
import { Loader2 } from 'lucide-react'
import { toast } from "@repo/ui/toast"

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdating(true)
    try {
      await updateOrderStatus(orderId, e.target.value)
    } catch (err) {
      toast.error("Error al actualizar el estado")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={isUpdating}
        className={`inline-flex items-center rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border-0 ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-accent-gold transition-all duration-300 cursor-pointer ${
          currentStatus === 'completed' ? 'text-green-600 ring-green-500/30 bg-green-500/5' :
          currentStatus === 'pending' ? 'ring-accent-gold/30 bg-accent-gold/5' :
          currentStatus === 'cancelled' ? 'text-red-500 ring-red-500/30 bg-red-500/5' :
          'ring-(--card-border) bg-(--background)'
        }`}
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          color: currentStatus === 'pending' ? 'var(--accent-gold)' : 
                 currentStatus === 'completed' ? '#16a34a' : 
                 currentStatus === 'cancelled' ? '#ef4444' : 'var(--foreground)'
        }}
      >
        <option value="pending" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--accent-gold)' }}>Pendiente</option>
        <option value="processing" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--foreground)' }}>Procesando</option>
        <option value="completed" style={{ backgroundColor: 'var(--card-bg)', color: '#16a34a' }}>Completado</option>
        <option value="cancelled" style={{ backgroundColor: 'var(--card-bg)', color: '#ef4444' }}>Cancelado</option>
      </select>
      {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-accent-gold" />}
    </div>

  )
}
