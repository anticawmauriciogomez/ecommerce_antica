import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleRequest = createMiddleware(routing);

export default function proxy(request: any) {
    return handleRequest(request);
}


export const config = {
    // Matcher que cubre todo menos archivos estáticos
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};