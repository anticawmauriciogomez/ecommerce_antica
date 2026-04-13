import { createClient } from '@/utils/supabase/server'

export default async function ReservationsPage() {
  const supabase = await createClient()

  const { data: reservations } = await supabase
    .from('reservations')
    .select('*')
    .order('reservation_date', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-normal tracking-tight" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-serif)' }}>
            Reservas
          </h1>
          <div className="flex items-center gap-3 mt-1">
             <div className="h-0.5 w-6 bg-accent-gold/40 rounded-full" />
             <p className="text-[10px] font-bold text-accent-gold/60 uppercase tracking-[2px]">
               Gestión de experiencias y mesa
             </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-(--card-border) bg-(--card-bg) shadow-[0_4px_20px_rgba(26,21,18,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent-gold/[0.03] text-[10px] font-bold uppercase tracking-widest text-accent-gold/60 border-b border-(--card-border)">
              <tr>
                <th scope="col" className="px-8 py-6">Cliente</th>
                <th scope="col" className="px-8 py-6">Contacto</th>
                <th scope="col" className="px-8 py-6">Fecha & Hora</th>
                <th scope="col" className="px-8 py-6">Personas</th>
                <th scope="col" className="px-8 py-6">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--card-border)">
              {reservations?.map((res: any) => (
                <tr key={res.id} className="hover:bg-accent-gold/[0.01] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-(--foreground)">{res.name}</div>
                  </td>
                  <td className="px-8 py-6 text-accent-gold/60 text-xs">
                    {res.phone || '-'}
                  </td>
                  <td className="px-8 py-6 text-(--foreground) font-medium italic text-xs">
                    {res.reservation_date} <span className="text-accent-gold/40 font-normal not-italic">a las {res.reservation_time}</span>
                  </td>
                  <td className="px-8 py-6">
                     <span className="inline-flex items-center rounded-lg bg-accent-gold/[0.05] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-accent-gold border border-accent-gold/10">
                        {res.number_of_guests} {res.number_of_guests === 1 ? 'persona' : 'personas'}
                     </span>
                  </td>
                  <td className="px-8 py-6">
                    <button className="text-accent-gold/70 hover:text-accent-gold font-bold text-[10px] uppercase tracking-widest transition-all hover:scale-105">
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
              {(!reservations || reservations.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-accent-gold/40 italic font-medium" style={{ fontFamily: 'var(--font-serif)' }}>
                    No se encontraron reservas
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
