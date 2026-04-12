import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "../../i18n/routing";
import { ScrollReveal } from "../ScrollReveal";
import styles from "./AboutSection.module.css";

const AboutSection = () => {
  const t = useTranslations("About");

  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        {/* Hero Section with Image */}
        <ScrollReveal direction="up" delay={0}>
          <div className={styles.heroSection}>
            <div className={styles.imageWrapper}>
              <img
                src="/media/DSC01203.jpg"
                alt="Antica M&M - El orgullo del sur de Colombia"
                className={styles.heroImage}
              />
              <div className={styles.imageOverlay}></div>
            </div>

            <div className={styles.heroContent}>
              <ScrollReveal direction="right" delay={300}>
                <h2 className={`${styles.mainTitle} text-serif`}>
                  {t("mainTitle")}
                </h2>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={500}>
                <div className={styles.titleDivider}></div>
              </ScrollReveal>
              <ScrollReveal direction="left" delay={700}>
                <p className={styles.heroSubtitle}>{t("boxSubtitle")}</p>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>

        {/* Featured Content */}
        <ScrollReveal direction="up" delay={200}>
          <div className={styles.contentGrid}>
            <ScrollReveal direction="left" delay={400}>
              <div className={styles.featuredCard}>
                <ScrollReveal direction="up" delay={500}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{t("boxTitle")}</h3>
                    <div className={styles.cardAccent}></div>
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="fade" delay={700}>
                  <div className={styles.cardContent}>
                    {t("boxText")
                      .split("\n")
                      .map((line, index) => (
                        <ScrollReveal key={index} direction="up" delay={800 + index * 200}>
                          <p className={index === 2 ? styles.highlightText : ""}>
                            {line}
                          </p>
                        </ScrollReveal>
                      ))}
                  </div>
                </ScrollReveal>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={600}>
              <div className={styles.storySection}>
                <div className={styles.storyContent}>
                  <ScrollReveal direction="up" delay={800}>
                    <p className={styles.storyParagraph}>{t("bodyParagraph1")}</p>
                  </ScrollReveal>
                  <ScrollReveal direction="up" delay={1000}>
                    <p className={styles.storyParagraph}>{t("bodyParagraph2")}</p>
                  </ScrollReveal>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </ScrollReveal>

        {/* Quote Section */}
        <ScrollReveal direction="up" delay={300}>
          <div className={styles.quoteSection}>
            <ScrollReveal direction="fade" delay={500}>
              <div className={styles.quoteCard}>
                <ScrollReveal direction="up" delay={700}>
                  <blockquote className={styles.blockquote}>
                    {t("finalQuote")}
                  </blockquote>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={900}>
                  <cite className={styles.author}>{t("finalAuthor")}</cite>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={1100}>
                  <div className={styles.quoteActions}>
                    <Link href="/nosotros">
                      <button className={styles.ctaButton}>
                        {t("discoverMore")}
                      </button>
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutSection;
