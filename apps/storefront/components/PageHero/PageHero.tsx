"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./PageHero.module.css";

interface PageHeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  backgroundImages?: string[];
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  backgroundImages,
  showButton = false,
  buttonText,
  buttonLink,
}) => {
  // Determine which images to use
  const images = backgroundImages || (backgroundImage ? [backgroundImage] : []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Image cycling effect
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(() => {
        const currentImageRef = imageRefs.current[currentImageIndex];
        if (!currentImageRef) return;
        const scrollY = window.scrollY;
        // Calculate scale: starts at 1 and zooms in as you scroll down
        const maxScale = 1.3;
        const scale = Math.min(1 + scrollY * 0.0004, maxScale);

        currentImageRef.style.transform = `scale(${scale})`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Execute once initially
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentImageIndex]);

  return (
    <section className={styles.hero}>
      <div className={styles.heroImageContainer}>
        {images.map((image, index) => (
          <img
            key={index}
            ref={(el) => {
              imageRefs.current[index] = el;
            }}
            src={image}
            alt={`Page Hero ${index + 1}`}
            className={`${styles.heroImage} ${
              index === currentImageIndex ? styles.active : ""
            }`}
          />
        ))}
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
