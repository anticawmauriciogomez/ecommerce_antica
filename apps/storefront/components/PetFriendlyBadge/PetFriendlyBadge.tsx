"use client";

import { Dog } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import styles from "./PetFriendlyBadge.module.css";

export function PetFriendlyBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("PetFriendly");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (badgeRef.current && !badgeRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      className={styles.container}
      ref={badgeRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div 
        className={styles.badge}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
      >
        <div className={styles.iconContainer}>
          <Dog size={20} />
        </div>
        <span className={styles.text}>{t("title")}</span>
      </div>

      <div className={`${styles.tooltip} ${isOpen ? styles.tooltipOpen : ""}`}>
        <p>{t("tooltip")}</p>
        <div className={styles.arrow} />
      </div>
    </div>
  );
}
