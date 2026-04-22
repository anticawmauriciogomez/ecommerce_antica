import { getLocale, getTranslations } from "next-intl/server";
import { supabase } from "@/lib/supabaseClient";
import { getCmsMedia } from "@/lib/cms";
import PageHero from "@/components/PageHero/PageHero";
import ProductsList from "@/components/ProductsList/ProductsList";
import styles from "./ProductosPage.module.css";

async function getProductsAndCategories() {
  const locale = await getLocale();

  try {
    // Get all categories
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*");

    if (catError) {
      console.error("Error fetching categories:", catError);
      return { products: [], categories: [] };
    }

    // Find the EXPERIENCIAS category to exclude
    const experienceCategory = categories?.find(
      (cat) =>
        cat.name &&
        cat.name[locale] === (locale === "es" ? "EXPERIENCIAS" : "EXPERIENCES"),
    );

    // Get products excluding experiences and only buyable ones
    let query = supabase.from("products").select("*").eq("buyable", true);
    if (experienceCategory) {
      query = query.neq("category_id", experienceCategory.id);
    }

    const { data: products, error: prodError } = await query;

    if (prodError) {
      console.error("Error fetching products:", prodError);
      return { products: [], categories: categories || [] };
    }

    // Also exclude experiences category from categories list
    const filteredCategories =
      categories?.filter(
        (cat) => !experienceCategory || cat.id !== experienceCategory.id,
      ) || [];

    return { products: products || [], categories: filteredCategories };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { products: [], categories: [] };
  }
}

export default async function ProductosPage() {
  const locale = await getLocale();

  // Add error handling for data fetching
  let products: any[] = [];
  let categories: any[] = [];
  try {
    const data = await getProductsAndCategories();
    products = data.products || [];
    categories = data.categories || [];
  } catch (error) {
    console.error("Error loading products and categories:", error);
  }

  let t;
  try {
    t = await getTranslations("ProductosPage");
  } catch (error) {
    console.error("Error loading translations:", error);
    // Fallback translations
    t = (key: string) => key;
  }

  // @cms-group "Cabeceras de Secciones" @cms-label "Galería de Imágenes Hero (Productos)" @cms-type gallery
  let heroImages: string[] = ["/media/DSC01073.jpg"];
  try {
    const cmsImages = await getCmsMedia("productos_hero_gallery", [
      "/media/DSC01073.jpg",
    ]);
    heroImages = Array.isArray(cmsImages) ? cmsImages : ["/media/DSC01073.jpg"];
  } catch (error) {
    console.error("Error loading hero images:", error);
  }

  return (
    <>
      <PageHero
        slides={heroImages.map((image) => ({
          image,
          title: t("title"),
          subtitle: t("subtitle"),
        }))}
      />

      {/* Products Section */}
      <section className={styles.productsSection}>
        <div className="container-custom">
          <ProductsList
            products={products}
            categories={categories}
            locale={locale}
            showCategoryFilter={true}
          />
        </div>
      </section>
    </>
  );
}
