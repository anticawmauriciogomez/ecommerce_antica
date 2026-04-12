import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "../../i18n/routing";
import styles from "./Hero.module.css";

const images = [
  "/media/DSC01073.jpg",
  "/media/DSC01203.jpg",
  "/media/DSC01209.jpg",
  "/media/DSC01454.jpg",
  "/media/DSC01707.jpg",
  "/media/DSC01839.jpg",
  "/media/DSC01841.jpg",
  "/media/DSC01959.jpg",
  "/media/DSC01979.jpg",
];

// Duplicamos para el scroll infinito
const sliderImages = [...images, ...images];

const Hero = () => {
  const t = useTranslations("Hero");

  return (
    <section className={styles.hero}>
      <div className={styles.heroSliderContainer}>
        <div className={styles.heroSliderTrack}>
          {sliderImages.map((src, index) => {
            // Calculamos la clase de ítem (1 al 5) para el efecto de onda
            const itemNumber = (index % 5) + 1;
            // Usamos la notación de corchetes para clases dinámicas en CSS Modules
            const itemClass = styles[`item${itemNumber}`];

            return (
              <div
                key={index}
                className={`${styles.heroSliderItem} ${itemClass}`}
              >
                {/* 
                  Nota: Usamos img estándar para respetar tu CSS. 
                  En Next.js a futuro podrías usar <Image src={src} fill /> 
                */}
                <img src={src} alt="Antica Coffee" loading="lazy" />
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.overlay}></div>

      <div className={`${styles.heroContent} ${styles.fadeIn}`}>
        <h1 className={`${styles.heroTitle} text-serif`}>
          {t("title")}
        </h1>
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
