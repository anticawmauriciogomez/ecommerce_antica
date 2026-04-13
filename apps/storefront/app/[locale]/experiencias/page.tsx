import { getLocale, getTranslations } from "next-intl/server";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard/ProductCard";
import { getCmsMedia } from "@/lib/cms";
import styles from "./ExperienciasPage.module.css";

type Product = {
  id: number;
  name: Record<string, string>;
  price: number;
  image_url: string | null;
};

async function getExperienceProducts() {
  const locale = await getLocale();

  try {
    // First, let's see what categories exist
    const { data: allCats, error: catError } = await supabase
      .from("categories")
      .select("*");

    if (catError) {
      console.error("Error fetching categories:", catError);
      return [];
    }

    // Find the category by name
    const categoryName = locale === "es" ? "Experiencia" : "Experience";
    const category = allCats?.find(
      (cat) => cat.name && cat.name[locale] === categoryName,
    );

    if (!category) {
      console.log("No category found with name:", categoryName);
      return [];
    }

    // Get products for this category
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category.id);

    if (prodError) {
      console.error("Error fetching products:", prodError);
      return [];
    }

    return products || [];
  } catch (err) {
    console.error("Unexpected error:", err);
    return [];
  }
}

export default async function ExperienciasPage() {
  const locale = await getLocale();
  const products: Product[] = await getExperienceProducts();
  const t = await getTranslations("ExperienciasPage");
  // @cms-group "Cabeceras de Secciones" @cms-label "Fondo de Cabecera (Experiencias)"
  const heroImage = await getCmsMedia("experiencias_hero", "/media/DSC01073.jpg") as string;

  return (
    <>
      {/* Hero Banner */}
      <section 
        className={styles.hero}
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${heroImage}')` }}
      >
        <div className={styles.heroOverlay}></div>
        <div className={`${styles.heroContent} container-custom`}>
          <h1 className={`${styles.heroTitle} text-serif`}>{t("title")}</h1>
          <p className={`${styles.heroSubtitle} text-sans`}>{t("subtitle")}</p>
          <div className={styles.heroDivider}></div>
        </div>
      </section>

      {/* Products Section */}
      <section className={styles.productsSection}>
        <div className="container-custom">
          {products.length > 0 ? (
            <div className={styles.grid}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>{t("emptyState")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
