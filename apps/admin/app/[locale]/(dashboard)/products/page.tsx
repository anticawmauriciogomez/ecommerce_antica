import { createClient } from "@/utils/supabase/server";
import { ProductList } from "./_components/ProductList";
import { deleteProduct } from "./actions";

export default async function ProductsPage() {
  const supabase = await createClient();

  // Joining with categories to get category names
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <ProductList 
      initialProducts={products || []} 
      deleteProductAction={deleteProduct} 
    />
  );
}
