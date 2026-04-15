import React from "react";
import { getLocale } from "next-intl/server";
import { supabase } from "@/lib/supabaseClient"; // Importamos nuestro cliente
import styles from "./CafeMenu.module.css";

// Definimos los tipos de datos que esperamos de Supabase
type MenuItem = {
  id: number;
  name: Record<string, string>;
  description: Record<string, string> | null;
  price: number;
};

type MenuCategory = {
  id: number;
  name: Record<string, string>;
  products: MenuItem[];
};

const CafeMenu = async () => {
  // Obtenemos el idioma actual ('es' o 'en') en el servidor
  const locale = await getLocale();

  // Hacemos la consulta a Supabase
  const { data: categories, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      name,
      products (
        id,
        name,
        description,
        price
      )
    `,
    )
    .order("sort_order", { ascending: true }) // Ordenamos por el campo sort_order
    .order("id", { foreignTable: "products", ascending: true }); // Ordenamos productos por id

  if (error || !categories) {
    // En un caso real, aquí podrías mostrar un componente de error
    console.error("Error fetching menu:", error);
    return <section>Error al cargar el menú.</section>;
  }

  // Render each category as a modern card
  const renderCategory = (category: MenuCategory) => (
    <div key={category.id} className={styles.menuCategory}>
      <h4 className={styles.categoryTitle}>{category.name[locale]}</h4>
      <div className={styles.menuItems}>
        {category.products.map((item) => (
          <div key={item.id} className={styles.menuItem}>
            <div className={styles.itemContent}>
              <span className={styles.itemName}>{item.name[locale]}</span>
              {item.description && item.description[locale] && (
                <span
                  className={styles.itemDesc}
                  dangerouslySetInnerHTML={{ __html: item.description[locale] }}
                />
              )}
            </div>
            <span className={styles.itemPrice}>${item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="cafe-menu" className={`${styles.cafeMenuSection} fade-in`}>
      <div className="container-custom">
        <div className="text-center mb-12 flex flex-col items-center">
          <h2
            className="text-serif text-5xl md:text-6xl mb-4"
            style={{ letterSpacing: "4px" }}
          >
            MENÚ
          </h2>
          <h3
            className="text-sans text-lg md:text-xl uppercase tracking-widest mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Antíca Café
          </h3>
          <div className={`${styles.menuDivider} mx-auto`}></div>
        </div>

        <div className={styles.menuGrid}>{categories.map(renderCategory)}</div>
      </div>
    </section>
  );
};

export default CafeMenu;
