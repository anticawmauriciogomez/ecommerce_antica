import { getCmsMedia } from '@/lib/cms';
import CheckoutUI from './_components/CheckoutUI';

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
    // @cms-group "Cabeceras de Secciones" @cms-label "Fondo de Cabecera (Checkout)"
    const heroImage = await getCmsMedia("checkout_hero", "/media/DSC01073.jpg") as string;

    return (
        <CheckoutUI heroImage={heroImage} />
    );
}