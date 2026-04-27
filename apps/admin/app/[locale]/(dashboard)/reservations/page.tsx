import { createClient } from '@/utils/supabase/server'
import { ReservationManager } from './_components/ReservationManager'

export default async function ReservationsPage() {
  const supabase = await createClient()

  const { data: reservations, error } = await supabase
    .from('reservations')
    .select('*')
    .order('reservation_date', { ascending: false })

  if (error) {
    console.error('Error fetching reservations:', error)
  }

  return (
    <ReservationManager initialReservations={reservations || []} />
  )
}
