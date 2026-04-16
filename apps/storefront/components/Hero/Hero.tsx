import { getTranslations } from "next-intl/server";
import { getCmsMedia } from "@/lib/cms";
import styles from "./Hero.module.css";
import { HeroClient } from "./HeroClient";

const Hero = async () => {
  const t = await getTranslations("Hero");
  // @cms-group "Home Page" @cms-label "Imágenes del Hero (Carrusel)" @cms-type gallery
  const dbImages = await getCmsMedia("home_hero_image", [
    "/media/DSC01073.jpg",
  ]);
  const images =
    Array.isArray(dbImages) && dbImages.length > 0
      ? dbImages
      : ["/media/DSC01073.jpg"];

  return (
    <HeroClient
      images={images}
      title={t("title")}
      subtitle={t("subtitle")}
      buttonText={t("button")}
    />
  );
};

export default Hero;
