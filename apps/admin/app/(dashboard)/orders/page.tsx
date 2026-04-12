import { createClient } from '@/utils/supabase/server'
import { OrderStatusSelect } from './_components/OrderStatusSelect'

export default async function OrdersPage() {
  const supabase = await createClient()

  // This fetches from the orders table we defined in the migration script
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Orders</h1>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Order ID</th>
                <th scope="col" className="px-6 py-4 font-medium">Customer</th>
                <th scope="col" className="px-6 py-4 font-medium">Total</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {orders?.map((order) => {
                const getStatusColor = (status: string) => {
                  switch(status) {
                    case 'completed': return 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20'
                    case 'pending': return 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-500/10 dark:text-yellow-400 dark:ring-yellow-500/20'
                    case 'cancelled': return 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20'
                    default: return 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20'
                  }
                }

                return (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{order.customer_name}</div>
                      <div className="text-xs">{order.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      $ {order.total_amount}
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No orders found
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
