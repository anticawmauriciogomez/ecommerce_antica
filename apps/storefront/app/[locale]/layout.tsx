import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/Header/Header";
import { cormorantGaramond, montserrat } from "../fonts";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { children } = props;
  const { locale } = await props.params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${cormorantGaramond.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico?v=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png?v=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png?v=1" />
        <link rel="manifest" href="/favicon/site.webmanifest?v=1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Antica M&M - Café de Especialidad" />
        <meta property="og:description" content="Descubre el mejor café del sur de Colombia en Antica M&M" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Antica M&M - Café de Especialidad" />
        <meta property="twitter:description" content="Descubre el mejor café del sur de Colombia en Antica M&M" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              function applyTheme() {
                console.log('Script starting...');
                try {
                  var theme = localStorage.getItem('theme');
                  console.log('Saved theme:', theme);
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    console.log('System theme detected:', theme);
                  }
                  console.log('Final theme to apply:', theme);
                  console.log('document.documentElement:', document.documentElement);
                  document.documentElement.setAttribute('data-theme', theme);
                  console.log('Theme applied, element now has:', document.documentElement.getAttribute('data-theme'));
                } catch (error) {
                  console.error('Theme script error:', error);
                }
              }

              // Try to apply theme immediately
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', applyTheme);
              } else {
                applyTheme();
              }
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <Header />
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
