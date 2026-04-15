import React from "react";
import { getTranslations } from "next-intl/server";
import { getCmsMedia } from "@/lib/cms";
import styles from "./SpacesHero.module.css";

const SpacesHero = async () => {
  const t = await getTranslations("Spaces");
  // @cms-group "Cabeceras de Secciones" @cms-label "Fondo de Cabecera (Espacios)" @cms-type single
  const heroImage = (await getCmsMedia(
    "espacios_hero",
    "/media/DSC01073.jpg",
  )) as string;

  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className={styles.overlay}></div>
      <div className={`${styles.heroContent} fadeIn`}>
        <h1 className={`${styles.heroTitle} text-serif`}>{t("heroTitle")}</h1>
        <p className={`${styles.heroSubtitle} text-sans`}>
          {t("heroSubtitle")}
        </p>
      </div>
    </section>
  );
};

export default SpacesHero;
