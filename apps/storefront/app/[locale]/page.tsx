import Hero from '@/components/Hero/Hero';
import CafeMenu from '@/components/CafeMenu/CafeMenu';
import ReservationForm from '@/components/ReservationForm/ReservationForm';
import AboutSection from '@/components/AboutSection/AboutSection';
import { ScrollReveal } from '@/components/ScrollReveal';
import { getCmsMedia } from '@/lib/cms';

// En Next.js 15, params es una Promesa
export default async function Home(props: {
  params: Promise<{ locale: string }>;
}) {
  // OBLIGATORIO: Esperar los params
  const { locale } = await props.params;
  
  // @cms-group "Home Page" @cms-label "Fondo Sección de Reservas"
  const reservationBg = await getCmsMedia("home_reservation_bg", "") as string;

  return (
    <main>
      <Hero />
      <AboutSection />
      <ScrollReveal direction="up" delay={400}>
        <CafeMenu />
      </ScrollReveal>
      <ScrollReveal direction="up" delay={600} threshold={0.05}>
        <ReservationForm reservationBg={reservationBg} />
      </ScrollReveal>
    </main>
  );
}