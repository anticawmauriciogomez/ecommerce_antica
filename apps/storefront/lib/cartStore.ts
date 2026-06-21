import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
    id: number;
    name: Record<string, string>;
    price: number;
    image_url: string | null;
    quantity: number;
    is_gift?: boolean;
    recipient_name?: string;
    recipient_email?: string;
    recipient_message?: string;
    voucher_value?: number;
};

interface CartState {
    items: CartItem[];
    addItem: (product: any) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product) => {
                const items = get().items;
                const existingItem = items.find((item) => item.id === product.id);

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...items, { ...product, quantity: 1 }] });
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((item) => item.id !== id) });
            },

            clearCart: () => set({ items: [] }),

            getTotalPrice: () => {
                return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            },

            getTotalItems: () => {
                return get().items.reduce((acc, item) => acc + item.quantity, 0);
            },
        }),
        {
            name: 'antica-cart-storage', // Nombre de la cookie/localStorage
        }
    )
);