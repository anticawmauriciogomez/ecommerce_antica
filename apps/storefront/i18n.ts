import { getRequestConfig } from "next-intl/server";
import { routing } from "./i18n/routing";
import { supabase } from "@/lib/supabaseClient";

function deepMerge(target: any, source: any) {
  if (typeof target !== "object" || target === null) return source;
  if (typeof source !== "object" || source === null) return source;

  const output = { ...target };
  Object.keys(source).forEach((key) => {
    if (
      source[key] !== null &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      if (!output[key]) output[key] = {};
      output[key] = deepMerge(output[key], source[key]);
    } else {
      // Only merge if the source is not empty! This prevents Admin clearing local strings accidentally
      if (
        source[key] !== "" &&
        source[key] !== undefined &&
        source[key] !== null
      ) {
        output[key] = source[key];
      }
    }
  });
  return output;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // 1. Await the requestLocale (required in Next.js 15/16)
  let locale = await requestLocale;

  // 2. Validate or fallback
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const staticMessages = (await import(`./messages/${locale}.json`)).default;

  let dbOverrides = {};
  try {
    const { data, error } = await supabase
      .from("storefront_content")
      .select("content")
      .eq("id", "translations")
      .single();
    if (!error && data?.content?.[locale]) {
      dbOverrides = data.content[locale];
    }
  } catch (e) {
    console.error("CMS Interceptor Error:", e);
  }

  const messages = deepMerge(staticMessages, dbOverrides);

  return {
    locale: locale as string,
    messages,
    parser: "simple",
    experimental: {
      validateMessages: false,
    },
  };
});
