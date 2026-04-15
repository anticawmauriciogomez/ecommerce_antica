"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import styles from "./SpacesSection.module.css";

interface SpacesSectionProps {
  imageSrc: string;
}

const SpacesSection: React.FC<SpacesSectionProps> = ({ imageSrc }) => {
  const t = useTranslations("Spaces");

  return (
    <section className={styles.spacesSection}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.imageContainer}>
            <img src={imageSrc} alt={t("imageAlt")} className={styles.image} />
          </div>
          <div className={styles.content}>
            <h2 className={styles.title}>{t("title")}</h2>
            <p className={styles.description}>{t("description")}</p>
            <Link href="/espacios">
              <button className={styles.button}>{t("button")}</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpacesSection;
