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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Overview</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <stat.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-4 truncate">
                  <p className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
