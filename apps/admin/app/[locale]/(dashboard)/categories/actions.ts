"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveCategory(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const name_es = formData.get("name_es") as string;
  const name_en = formData.get("name_en") as string;
  const exclude_from_menu = formData.get("exclude_from_menu") === "on";

  const name = { es: name_es, en: name_en };

  if (id) {
    const { error } = await supabase
      .from("categories")
      .update({ name, exclude_from_menu })
      .eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("categories")
      .insert([{ name, exclude_from_menu }]);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/categories");
  // We can return a success indicator to the client action or just rely on redirect in client
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/categories");
}
