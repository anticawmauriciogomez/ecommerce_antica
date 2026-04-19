"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import styles from "./SpacesCarousel.module.css";

interface Space {
  id: string;
  title: string;
  description: string;
  images: string[];
}

interface SpaceCardProps {
  space: Space;
}

interface SpacesCarouselProps {
  spacesData?: Space[];
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Cambiar imagen cada 10 segundos para esta tarjeta específica
  useEffect(() => {
    if (space.images.length <= 1) return;

    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % space.images.length);
    }, 10000);

    return () => clearInterval(imageInterval);
  }, [space.images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % space.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + space.images.length) % space.images.length,
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className={styles.spaceCard}>
      <div className={styles.cardImageContainer}>
        <img
          src={space.images[currentImageIndex]}
          alt={space.title}
          className={styles.cardImage}
        />

        {space.images.length > 1 && (
          <>
            <button
              className={`${styles.imageNav} ${styles.prev}`}
              onClick={prevImage}
            >
              ‹
            </button>
            <button
              className={`${styles.imageNav} ${styles.next}`}
              onClick={nextImage}
            >
              ›
            </button>

            <div className={styles.cardImageIndicators}>
              {space.images.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.cardIndicator} ${index === currentImageIndex ? styles.active : ""}`}
                  onClick={() => goToImage(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{space.title}</h3>
        <p className={styles.cardDescription}>{space.description}</p>
      </div>
    </div>
  );
};

const SpacesCarousel: React.FC<SpacesCarouselProps> = ({ spacesData }) => {
  const t = useTranslations("Spaces");

  // Datos por defecto si no se pasan props
  const defaultSpaces: Space[] = [
    {
      id: "1",
      title: t("space1.title"),
      description: t("space1.description"),
      images: [
        "/media/DSC01979.jpg",
        "/media/DSC01841.jpg",
        "/media/DSC01839.jpg",
        "/media/DSC01707.jpg",
        "/media/DSC01073.jpg",
      ],
    },
    {
      id: "2",
      title: t("space2.title"),
      description: t("space2.description"),
      images: [
        "/media/DSC01707.jpg",
        "/media/DSC01073.jpg",
        "/media/DSC01454.jpg",
        "/media/DSC01209.jpg",
        "/media/DSC01203.jpg",
      ],
    },
    {
      id: "3",
      title: t("space3.title"),
      description: t("space3.description"),
      images: [
        "/media/DSC01209.jpg",
        "/media/DSC01203.jpg",
        "/media/regala/exp-roma1.jpg",
        "/media/DSC01979.jpg",
        "/media/DSC01841.jpg",
      ],
    },
  ];

  const spaces = spacesData || defaultSpaces;

  return (
    <section className={styles.carouselSection}>
      <div className={styles.container}>
        <div className={styles.spacesGrid}>
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpacesCarousel;
