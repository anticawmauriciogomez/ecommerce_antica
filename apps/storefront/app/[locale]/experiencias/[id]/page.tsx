import { getLocale, getTranslations } from 'next-intl/server';
import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import styles from './ProductDetail.module.css'; // Crearemos este CSS ahora
import AddToCartButton from '@/components/AddToCartButton';

interface PageProps {
    params: Promise<{ locale: string; id: string }>;
}

async function getProduct(id: string) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return data;
}

export default async function ProductDetailPage({ params }: PageProps) {
    // 1. Esperamos los parámetros (Next.js 15/16 style)
    const { locale, id } = await params;

    // 2. Obtenemos el producto de Supabase
    const product = await getProduct(id);

    // 3. Si no existe el producto, lanzamos un 404
    if (!product) {
        notFound();
    }

    const t = await getTranslations('GiftPage');

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.grid}>

                    {/* Columna Imagen */}
                    <div className={styles.imageContainer}>
                        {product.image_url ? (
                            <img src={product.image_url} alt={product.name[locale]} className={styles.image} />
                        ) : (
                            <div className={styles.placeholder} />
                        )}
                    </div>

                    {/* Columna Información */}
                    <div className={styles.info}>
                        <h1 className={styles.title}>{product.name[locale]}</h1>
                        <p className={styles.price}>${product.price}</p>
                        <div className={styles.divider} />
                        <div 
                            className={styles.description}
                            dangerouslySetInnerHTML={{ __html: product.description?.[locale] || 'Sin descripción disponible.' }}
                        />

                        <AddToCartButton product={product} />
                    </div>

                </div>
            </div>
        </div>
    );
}