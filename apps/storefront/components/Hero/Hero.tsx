import { getMessages } from "next-intl/server";
import { getCmsMedia } from "@/lib/cms";
import { HeroClient } from "./HeroClient";

const Hero = async () => {
  const messages = await getMessages();

  // @cms-group "Home Page" @cms-label "Imágenes del Hero (Carrusel)" @cms-type gallery
  const dbImages = await getCmsMedia("home_hero_image", [
    "/media/DSC01073.jpg",
  ]);
  const images =
    Array.isArray(dbImages) && dbImages.length > 0
      ? dbImages
      : ["/media/DSC01073.jpg"];

  // Get texts for each slide from translations
  const title1 = messages.Hero?.home_hero_title1 || "Este sueño no empezó hoy";
  const subtitle1 =
    messages.Hero?.home_hero_subtitle1 ||
    "Empezó hace muchos años en las manos de quienes nos enseñaron a trabajar, creer y amar. Hoy Antica M&M honra ese legado atemporal.";
  const button1 =
    messages.Hero?.home_hero_button1 || "Descubre Nuestra Historia";
  const link1 = messages.Hero?.home_hero_link1 || "/es/nosotros";

  const title2 = messages.Hero?.home_hero_title2 || "Experiencias Únicas";
  const subtitle2 =
    messages.Hero?.home_hero_subtitle2 ||
    "Vive momentos inolvidables con nuestro café premium y experiencias exclusivas.";
  const button2 = messages.Hero?.home_hero_button2 || "Explorar Experiencias";
  const link2 = messages.Hero?.home_hero_link2 || "/es/experiencias";

  const title3 = messages.Hero?.home_hero_title3 || "Productos Exclusivos";
  const subtitle3 =
    messages.Hero?.home_hero_subtitle3 ||
    "Descubre nuestra selección de productos de alta calidad para llevar el sabor de Antica a casa.";
  const button3 = messages.Hero?.home_hero_button3 || "Ver Productos";
  const link3 = messages.Hero?.home_hero_link3 || "/es/productos";

  // Create slides: use images, and assign texts
  const slideTexts = [
    {
      title: title1,
      subtitle: subtitle1,
      buttonText: button1,
      buttonLink: link1,
    },
    {
      title: title2,
      subtitle: subtitle2,
      buttonText: button2,
      buttonLink: link2,
    },
    {
      title: title3,
      subtitle: subtitle3,
      buttonText: button3,
      buttonLink: link3,
    },
  ];

  const slides = images.map((image, index) => {
    const i = Math.min(index, 2);
    return {
      image,
      title: slideTexts[i]!.title,
      subtitle: slideTexts[i]!.subtitle,
      buttonText: slideTexts[i]!.buttonText,
      buttonLink: slideTexts[i]!.buttonLink,
    };
  });

  return <HeroClient slides={slides} />;
};

export default Hero;
