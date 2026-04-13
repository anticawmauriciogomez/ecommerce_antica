import { createClient } from '@/utils/supabase/server'
import { Package, Tags, ShoppingCart, CalendarDays } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: ordersCount },
    { count: reservationsCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('reservations').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { name: 'Total Products', value: productsCount || 0, icon: Package },
    { name: 'Categories', value: categoriesCount || 0, icon: Tags },
    { name: 'Pending Orders', value: ordersCount || 0, icon: ShoppingCart },
    { name: 'Reservations', value: reservationsCount || 0, icon: CalendarDays },
  ]

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-normal tracking-tight" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-serif)' }}>
          Resumen del Negocio
        </h1>
        <div className="flex items-center gap-3">
           <div className="h-1 w-8 bg-accent-gold rounded-full" />
           <p className="text-[10px] font-bold text-accent-gold/60 uppercase tracking-[4px]">
             Panel de control administrativo
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="group relative overflow-hidden rounded-3xl border border-(--card-border) bg-(--card-bg) p-8 shadow-[0_4px_20px_rgba(26,21,18,0.03)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(203,168,124,0.1)] hover:-translate-y-2"
          >
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-gold/[0.07] text-accent-gold border border-accent-gold/10 transition-all duration-500 group-hover:bg-accent-gold group-hover:text-white group-hover:scale-110 group-hover:rotate-3">
                <stat.icon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent-gold/50">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold tracking-tight text-(--foreground) mt-1">
                  {stat.value}
                </p>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute -right-4 -bottom-4 h-24 w-24 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-700 group-hover:scale-125 group-hover:rotate-12 pointer-events-none">
               <stat.icon className="h-full w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>

  )
}
