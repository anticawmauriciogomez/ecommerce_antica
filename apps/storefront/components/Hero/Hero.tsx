import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "../../i18n/routing";
import { getCmsMedia } from "@/lib/cms";
import styles from "./Hero.module.css";
import { HeroImage } from "./HeroImage";

const Hero = async () => {
  const t = await getTranslations("Hero");
  // @cms-group "Home Page" @cms-label "Imagen Principal (Hero)" @cms-type single
  const dbImage = await getCmsMedia("home_hero_image", "/media/DSC01073.jpg");
  const heroImageSrc =
    typeof dbImage === "string"
      ? dbImage
      : Array.isArray(dbImage) && dbImage.length > 0
        ? dbImage[0]
        : "/media/DSC01073.jpg";

  return (
    <section className={styles.hero}>
      <HeroImage src={heroImageSrc as string} />

      <div className={styles.overlay}></div>

      <div className={`${styles.heroContent} ${styles.fadeIn}`}>
        <h1 className={`${styles.heroTitle} text-serif`}>{t("title")}</h1>
        <p className={`${styles.heroSubtitle} text-sans`}>{t("subtitle")}</p>
        <Link href="/nosotros">
          <button className={`${styles.btnPrimary} ${styles.pointerAuto}`}>
            {t("button")}
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
