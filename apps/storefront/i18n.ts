import { getRequestConfig } from 'next-intl/server';
import { routing } from './i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // 1. Await the requestLocale (required in Next.js 15/16)
    let locale = await requestLocale;

    // 2. Validate or fallback
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }

    const messages = (await import(`./messages/${locale}.json`)).default;

    return {
        locale: locale as string,
        messages
    };
});