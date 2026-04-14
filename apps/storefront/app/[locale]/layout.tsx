import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/Header/Header";
import { cormorantGaramond, montserrat } from "../fonts";
import "../globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getCmsMedia } from "@/lib/cms";

import { Toaster } from "@repo/ui/toast";

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { children } = props;
  const { locale } = await props.params;

  // ... (rest of the code)

  return (
    <html
      lang={locale}
      className={`${cormorantGaramond.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* ... (head content) */}
      </head>
      <body>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <Header logoUrl={logoUrl} />
            {children}
            <Toaster position="bottom-right" expand={false} richColors />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
