import { supabase } from '@/lib/supabaseClient'

export async function getCmsMedia(slotKey: string, fallbackData: string | string[]): Promise<string | string[]> {
    try {
        const { data, error } = await supabase
           .from('storefront_content')
           .select('content')
           .eq('id', 'media_registry')
           .single();

        if (!error && data?.content && data.content[slotKey]) {
           // Si el array de imagenes de DB está vacío (lo borraron del admin) o el simple está vacío, devolvemos fallback
           const val = data.content[slotKey];
           if (Array.isArray(val) && val.length === 0) return fallbackData;
           if (typeof val === 'string' && val.trim() === '') return fallbackData;
           
           return val;
        }
    } catch (e) {
        console.error('Error fetching CMS media', e);
    }
    return fallbackData;
}
