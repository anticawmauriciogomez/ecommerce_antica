"use client";

import React, { useEffect, useRef } from "react";
import styles from "./PageHero.module.css";

interface PageHeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  showButton = false,
  buttonText,
  buttonLink,
}) => {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        if (!imageRef.current) return;
        const scrollY = window.scrollY;
        // Calculate scale: starts at 1 and zooms in as you scroll down
        const maxScale = 1.3;
        const scale = Math.min(1 + scrollY * 0.0004, maxScale);

        imageRef.current.style.transform = `scale(${scale})`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Execute once initially
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.heroImageContainer}>
        <img
          ref={imageRef}
          src={backgroundImage}
          alt="Page Hero"
          className={styles.heroImage}
        />
      </div>
      <div className={styles.overlay}></div>
      <div className={`${styles.heroContent} fadeIn`}>
        <h1 className={`${styles.heroTitle} text-serif`}>{title}</h1>
        <p className={`${styles.heroSubtitle} text-sans`}>{subtitle}</p>
        {showButton && buttonText && buttonLink && (
          <a href={buttonLink} className={styles.heroButton}>
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
};

export default PageHero;
