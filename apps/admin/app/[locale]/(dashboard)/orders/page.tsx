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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-normal tracking-tight" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-serif)' }}>
            Pedidos
          </h1>
          <div className="flex items-center gap-3 mt-1">
             <div className="h-0.5 w-6 bg-accent-gold/40 rounded-full" />
             <p className="text-[10px] font-bold text-accent-gold/60 uppercase tracking-[2px]">
               Gestión de ventas y transacciones
             </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-(--card-border) bg-(--card-bg) shadow-[0_4px_20px_rgba(26,21,18,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent-gold/[0.03] text-[10px] font-bold uppercase tracking-widest text-accent-gold/60 border-b border-(--card-border)">
              <tr>
                <th scope="col" className="px-8 py-6">Orden ID</th>
                <th scope="col" className="px-8 py-6">Cliente</th>
                <th scope="col" className="px-8 py-6">Total</th>
                <th scope="col" className="px-8 py-6">Estado</th>
                <th scope="col" className="px-8 py-6">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--card-border)">
              {orders?.map((order) => {
                return (
                  <tr key={order.id} className="hover:bg-accent-gold/[0.01] transition-colors group">
                    <td className="px-8 py-6">
                      <span className="font-mono text-[9px] px-2 py-1 rounded bg-accent-gold/10 text-accent-gold/70 font-bold border border-accent-gold/10">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="font-bold text-(--foreground) text-sm">{order.customer_name}</div>
                      <div className="text-[10px] uppercase tracking-wider text-accent-gold/50">{order.customer_email}</div>
                    </td>
                    <td className="px-8 py-6 font-bold text-(--foreground) italic">
                      S/ {order.total_amount}
                    </td>
                    <td className="px-8 py-6">
                      <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                    </td>
                    <td className="px-8 py-6 text-accent-gold/50 text-[10px] font-bold uppercase tracking-wider">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-accent-gold/40 italic font-medium" style={{ fontFamily: 'var(--font-serif)' }}>
                    No se encontraron pedidos
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
