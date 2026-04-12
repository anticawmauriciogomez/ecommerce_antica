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
        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border-0 ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 bg-transparent ${
          currentStatus === 'completed' ? 'text-green-700 ring-green-600/20' :
          currentStatus === 'pending' ? 'text-yellow-800 ring-yellow-600/20' :
          currentStatus === 'cancelled' ? 'text-red-700 ring-red-600/20' :
          'text-blue-700 ring-blue-700/10'
        }`}
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      {isUpdating && <Loader2 className="w-3 h-3 animate-spin text-gray-500" />}
    </div>
  )
}
