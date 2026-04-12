"use client";
import { useCartStore } from '@/lib/cartStore';
import { useTranslations } from 'next-intl';

export default function AddToCartButton({ product }: { product: any }) {
    const addItem = useCartStore((state) => state.addItem);
    const t = useTranslations('GiftPage'); // O la sección donde tengas el texto

    return (
        <button
            className="btn btn-primary"
            onClick={() => addItem(product)}
            style={{ width: '100%' }} // O el estilo que prefieras
        >
            {t('addToCart')}
        </button>
    );
}