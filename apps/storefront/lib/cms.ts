import { supabase } from "@/lib/supabaseClient";

export async function getCmsMedia(
  slotKey: string,
  fallbackData: string | string[],
): Promise<string | string[]> {
  try {
    const { data, error } = await supabase
      .from("storefront_content")
      .select("content")
      .eq("id", "media_registry")
      .single();

    if (!error && data?.content && data.content[slotKey]) {
      const val = data.content[slotKey];
      if (Array.isArray(val) && val.length === 0) return fallbackData;
      if (typeof val === "string" && val.trim() === "") return fallbackData;

      return val;
    }
  } catch (e) {
    console.error("Error fetching CMS media", e);
  }
  return fallbackData;
}

export async function getCmsText(
  locale: string,
  textKey: string,
  fallbackData: string,
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("storefront_content")
      .select("content")
      .eq("id", "translations")
      .single();

    if (error || !data?.content || !data.content[locale]) {
      return fallbackData;
    }

    const path = textKey.split(".");
    let val: any = data.content[locale];
    for (const p of path) {
      val = val?.[p];
    }
    if (typeof val === "string" && val.trim() !== "") {
      return processDbText(val);
    }
    return fallbackData;
  } catch (e) {
    console.error("Error fetching CMS text", e);
  }
  return fallbackData;
}

export function processDbText(html: string): string {
  if (typeof html !== "string") return html;

  // 1. Decodificar entidades HTML comunes (incluso si vienen doblemente escapadas)
  let text = html;
  let prev = "";
  let iterations = 0;

  while (text !== prev && iterations < 5) {
    prev = text;
    text = text
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");

    // Decodificar entidades numéricas como &#60; (<) o hex &#x3C; (<)
    text = text.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
    text = text.replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    );

    iterations++;
  }

  // 2. Normalizar párrafos del editor
  // Si hay múltiples párrafos, convertirlos en saltos de línea dobles
  text = text.replace(/<\/p>\s*<p>/gi, "<br/><br/>");

  // Si el texto está envuelto en un solo par de <p>...</p>, quitarlo para no romper el layout
  if (
    text.startsWith("<p>") &&
    text.endsWith("</p>") &&
    (text.match(/<p>/g) || []).length === 1
  ) {
    text = text.substring(3, text.length - 4);
  }

  // 3. Limpiar tags pero MANTENER los de formato (allowlist)
  // Reemplazamos <br> por una versión estándar
  text = text.replace(/<br\s*\/?>/gi, "<br/>");

  // Eliminar cualquier etiqueta que NO sea: b, strong, i, em, u, br (abriendo o cerrando)
  text = text.replace(
    /<(?!\/?(b|strong|i|em|u|br)\b)[^>]+>/gi,
    "",
  );

  return text.trim();
}

export async function getSettings(key: string, fallback: any): Promise<any> {
  try {
    const { data, error } = await supabase
      .from("admin_config")
      .select("value")
      .eq("key", key)
      .single();

    if (!error && data?.value !== undefined) {
      return data.value;
    }
  } catch (e) {
    console.error("Error fetching settings", e);
  }
  return fallback;
}
