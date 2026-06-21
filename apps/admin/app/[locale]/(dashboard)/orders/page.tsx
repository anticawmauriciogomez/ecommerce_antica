import { createClient } from '@/utils/supabase/server'
import { getCurrency } from '@/utils/currency'
import { OrderList } from './_components/OrderList'

export default async function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const supabase = await createClient()
  const { locale } = await params
  const currency = await getCurrency()

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

      <OrderList orders={(orders as any) || []} locale={locale} currency={currency} />
    </div>
  )
}
