import { createClient } from './supabase/server'

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  PEN: 'S/',
  COP: '$',
  EUR: '€',
  MXN: '$',
  CLP: '$',
  ARS: '$',
}

export async function getCurrency(): Promise<{ code: string; symbol: string }> {
  try {
    const supabase = await createClient()

    // Try store_settings first (nested JSON: { currency: "..." })
    const { data: storeData } = await supabase
      .from('admin_config')
      .select('value')
      .eq('key', 'store_settings')
      .maybeSingle()

    if (storeData?.value) {
      const code = (storeData.value as any)?.currency
      if (code) {
        return { code, symbol: CURRENCY_SYMBOLS[code] || code }
      }
    }

    // Fallback: try standalone "currency" key
    const { data: currencyData } = await supabase
      .from('admin_config')
      .select('value')
      .eq('key', 'currency')
      .maybeSingle()

    if (currencyData?.value) {
      const code = typeof currencyData.value === 'string'
        ? currencyData.value
        : (currencyData.value as any)?.value || (currencyData.value as any)?.currency
      if (code) {
        return { code, symbol: CURRENCY_SYMBOLS[code] || code }
      }
    }

    console.warn('[currency] No currency config found in admin_config, using default PEN')
    return { code: 'PEN', symbol: 'S/' }
  } catch (error) {
    console.error('[currency] Error fetching currency config:', error)
    return { code: 'PEN', symbol: 'S/' }
  }
}
