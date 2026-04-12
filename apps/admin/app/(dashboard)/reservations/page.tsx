import { createClient } from '@/utils/supabase/server'

export default async function ReservationsPage() {
  const supabase = await createClient()

  const { data: reservations } = await supabase
    .from('reservations')
    .select('*')
    .order('reservation_date', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Reservations</h1>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Customer</th>
                <th scope="col" className="px-6 py-4 font-medium">Contact</th>
                <th scope="col" className="px-6 py-4 font-medium">Date & Time</th>
                <th scope="col" className="px-6 py-4 font-medium">Guests</th>
                <th scope="col" className="px-6 py-4 items-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {reservations?.map((res: any) => (
                <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {res.name}
                  </td>
                  <td className="px-6 py-4">
                    {res.phone || '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                    {res.reservation_date} <span className="text-gray-500 dark:text-gray-400 font-normal">at {res.reservation_time}</span>
                  </td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20">
                        {res.number_of_guests} people
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">View</button>
                  </td>
                </tr>
              ))}
              {(!reservations || reservations.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No reservations found
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
