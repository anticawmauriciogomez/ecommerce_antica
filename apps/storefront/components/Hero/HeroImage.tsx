"use client";

import React, { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

interface HeroImageProps {
  src: string;
}

export const HeroImage: React.FC<HeroImageProps> = ({ src }) => {
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
    <div className={styles.heroImageContainer}>
      <img
        ref={imageRef}
        src={src}
        alt="Antica Hero"
        className={styles.heroSingleImage}
      />
    </div>
  );
};
