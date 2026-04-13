'use client'

import { useState } from 'react'
import { updateOrderStatus } from '../actions'
import { Loader2 } from 'lucide-react'

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdating(true)
    try {
      await updateOrderStatus(orderId, e.target.value)
    } catch (err) {
      alert("Failed to update status")
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
        className={`inline-flex items-center rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border-0 ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-accent-gold bg-white shadow-sm transition-all duration-300 ${
          currentStatus === 'completed' ? 'text-green-600 ring-green-100 bg-green-50/30' :
          currentStatus === 'pending' ? 'text-accent-gold ring-accent-gold/20 bg-accent-gold/5' :
          currentStatus === 'cancelled' ? 'text-red-500 ring-red-100 bg-red-50/30' :
          'text-gray-500 ring-gray-200 bg-gray-50/30'
        }`}
      >
        <option value="pending">Pendiente</option>
        <option value="processing">Procesando</option>
        <option value="completed">Completado</option>
        <option value="cancelled">Cancelado</option>
      </select>
      {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-accent-gold" />}
    </div>

  )
}
