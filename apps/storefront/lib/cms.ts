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
  textKey: string,
  fallbackData: string,
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("storefront_content")
      .select("content")
      .eq("id", "translations")
      .single();

    if (!error && data?.content && data.content[textKey]) {
      const val = data.content[textKey];
      if (typeof val === "string" && val.trim() !== "") {
        return val;
      }
    }
  } catch (e) {
    console.error("Error fetching CMS text", e);
  }
  return fallbackData;
}
