import { getTranslations } from "next-intl/server";
import PageHero from "@/components/PageHero/PageHero";
import SpacesCarousel from "@/components/SpacesCarousel/SpacesCarousel";
import { getCmsMedia } from "@/lib/cms";

export default async function SpacesPage() {
  const t = await getTranslations("Spaces");

  // Obtener imagen del hero
  // @cms-group "Cabeceras de Secciones" @cms-label "Fondo de Cabecera (Espacios)" @cms-type single
  const heroImage = (await getCmsMedia(
    "espacios_hero",
    "/media/DSC01073.jpg",
  )) as string;

  // Obtener imágenes del CMS para cada espacio
  // @cms-group "Página Espacios" @cms-label "Imágenes Espacio 1" @cms-type gallery
  const space1Images = await getCmsMedia("espacios_imagenes_1", [
    "/media/DSC01979.jpg",
    "/media/DSC01841.jpg",
    "/media/DSC01839.jpg",
    "/media/DSC01707.jpg",
    "/media/DSC01073.jpg",
  ]);
  // @cms-group "Página Espacios" @cms-label "Imágenes Espacio 2" @cms-type gallery
  const space2Images = await getCmsMedia("espacios_imagenes_2", [
    "/media/DSC01707.jpg",
    "/media/DSC01073.jpg",
    "/media/DSC01454.jpg",
    "/media/DSC01209.jpg",
    "/media/DSC01203.jpg",
  ]);
  // @cms-group "Página Espacios" @cms-label "Imágenes Espacio 3" @cms-type gallery
  const space3Images = await getCmsMedia("espacios_imagenes_3", [
    "/media/DSC01209.jpg",
    "/media/DSC01203.jpg",
    "/media/regala/exp-roma1.jpg",
    "/media/DSC01979.jpg",
    "/media/DSC01841.jpg",
  ]);
  // @cms-group "Página Espacios" @cms-label "Imágenes Espacio 4" @cms-type gallery
  const space4Images = await getCmsMedia("espacios_imagenes_4", [
    "/media/DSC01979.jpg",
    "/media/DSC01841.jpg",
    "/media/DSC01839.jpg",
  ]);
  // @cms-group "Página Espacios" @cms-label "Imágenes Espacio 5" @cms-type gallery
  const space5Images = await getCmsMedia("espacios_imagenes_5", [
    "/media/DSC01707.jpg",
    "/media/DSC01073.jpg",
    "/media/DSC01454.jpg",
  ]);
  // @cms-group "Página Espacios" @cms-label "Imágenes Espacio 6" @cms-type gallery
  const space6Images = await getCmsMedia("espacios_imagenes_6", [
    "/media/DSC01209.jpg",
    "/media/DSC01203.jpg",
    "/media/DSC01979.jpg",
  ]);

  const spacesData = [
    {
      id: "1",
      title: t.raw("space1.title"),
      description: t.raw("space1.description"),
      images: Array.isArray(space1Images)
        ? space1Images
        : [space1Images].filter(Boolean),
    },
    {
      id: "2",
      title: t.raw("space2.title"),
      description: t.raw("space2.description"),
      images: Array.isArray(space2Images)
        ? space2Images
        : [space2Images].filter(Boolean),
    },
    {
      id: "3",
      title: t.raw("space3.title"),
      description: t.raw("space3.description"),
      images: Array.isArray(space3Images)
        ? space3Images
        : [space3Images].filter(Boolean),
    },
    {
      id: "4",
      title: t.raw("space4.title"),
      description: t.raw("space4.description"),
      images: Array.isArray(space4Images)
        ? space4Images
        : [space4Images].filter(Boolean),
    },
    {
      id: "5",
      title: t.raw("space5.title"),
      description: t.raw("space5.description"),
      images: Array.isArray(space5Images)
        ? space5Images
        : [space5Images].filter(Boolean),
    },
    {
      id: "6",
      title: t.raw("space6.title"),
      description: t.raw("space6.description"),
      images: Array.isArray(space6Images)
        ? space6Images
        : [space6Images].filter(Boolean),
    },
  ];

  return (
    <main>
      <PageHero
        slides={[
          {
            image: heroImage,
            title: t.raw("heroTitle"),
            subtitle: t.raw("heroSubtitle"),
          },
        ]}
      />
      <SpacesCarousel spacesData={spacesData} />
    </main>
  );
}
