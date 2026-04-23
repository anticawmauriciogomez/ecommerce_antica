import { getTranslations } from "next-intl/server";
import PageHero from "@/components/PageHero/PageHero";
import SpacesCarousel from "@/components/SpacesCarousel/SpacesCarousel";
import { getCmsMedia, getCmsText } from "@/lib/cms";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function ChefPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations("Chef");

  // Obtener imagen del hero
  // @cms-group "Cabeceras de Secciones" @cms-label "Fondo de Cabecera (Chef)" @cms-type single
  const heroImage = (await getCmsMedia(
    "chef_hero",
    "/media/DSC01073.jpg",
  )) as string;

  // @cms-group "Página Chef" @cms-label "Título Hero"
  const heroTitle = await getCmsText(locale, "Chef.heroTitle", "Nuestro Chef");

  // @cms-group "Página Chef" @cms-label "Subtítulo Hero"
  const heroSubtitle = await getCmsText(
    locale,
    "Chef.heroSubtitle",
    "Pasión por la cocina que transforma cada plato en una obra de arte",
  );

  // Obtener imágenes del CMS para cada sección del chef
  // @cms-group "Página Chef" @cms-label "Imágenes Chef 1" @cms-type gallery
  const chef1Images = await getCmsMedia("chef_imagenes_1", [
    "/media/DSC01979.jpg",
    "/media/DSC01841.jpg",
    "/media/DSC01839.jpg",
    "/media/DSC01707.jpg",
    "/media/DSC01073.jpg",
  ]);
  // @cms-group "Página Chef" @cms-label "Imágenes Chef 2" @cms-type gallery
  const chef2Images = await getCmsMedia("chef_imagenes_2", [
    "/media/DSC01707.jpg",
    "/media/DSC01073.jpg",
    "/media/DSC01454.jpg",
    "/media/DSC01209.jpg",
    "/media/DSC01203.jpg",
  ]);
  // @cms-group "Página Chef" @cms-label "Imágenes Chef 3" @cms-type gallery
  const chef3Images = await getCmsMedia("chef_imagenes_3", [
    "/media/DSC01209.jpg",
    "/media/DSC01203.jpg",
    "/media/regala/exp-roma1.jpg",
    "/media/DSC01979.jpg",
    "/media/DSC01841.jpg",
  ]);

  // Textos para las tarjetas
  // @cms-group "Página Chef" @cms-label "Título Espacio 1"
  const space1Title = await getCmsText(
    locale,
    "Chef.space1.title",
    "Biografía del Chef",
  );
  // @cms-group "Página Chef" @cms-label "Descripción Espacio 1"
  const space1Description = await getCmsText(
    locale,
    "Chef.space1.description",
    "Descubre el viaje culinario de nuestro chef...",
  );

  // @cms-group "Página Chef" @cms-label "Título Espacio 2"
  const space2Title = await getCmsText(
    locale,
    "Chef.space2.title",
    "Especialidades",
  );
  // @cms-group "Página Chef" @cms-label "Descripción Espacio 2"
  const space2Description = await getCmsText(
    locale,
    "Chef.space2.description",
    "Platos signature creados con ingredientes frescos...",
  );

  // @cms-group "Página Chef" @cms-label "Título Espacio 3"
  const space3Title = await getCmsText(
    locale,
    "Chef.space3.title",
    "Filosofía Culinaria",
  );
  // @cms-group "Página Chef" @cms-label "Descripción Espacio 3"
  const space3Description = await getCmsText(
    locale,
    "Chef.space3.description",
    "La visión que guía nuestra cocina...",
  );

  const chefData = [
    {
      id: "1",
      title: space1Title,
      description: space1Description,
      images: Array.isArray(chef1Images)
        ? chef1Images
        : [chef1Images].filter(Boolean),
    },
    {
      id: "2",
      title: space2Title,
      description: space2Description,
      images: Array.isArray(chef2Images)
        ? chef2Images
        : [chef2Images].filter(Boolean),
    },
    {
      id: "3",
      title: space3Title,
      description: space3Description,
      images: Array.isArray(chef3Images)
        ? chef3Images
        : [chef3Images].filter(Boolean),
    },
  ];

  return (
    <main>
      <PageHero
        slides={[
          {
            image: heroImage,
            title: heroTitle,
            subtitle: heroSubtitle,
          },
        ]}
      />
      <SpacesCarousel spacesData={chefData} />
    </main>
  );
}
