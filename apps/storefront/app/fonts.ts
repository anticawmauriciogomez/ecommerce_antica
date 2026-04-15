// app/fonts.ts
import {
  Cormorant_Garamond,
  Montserrat,
  Abril_Fatface,
} from "next/font/google";

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif", // Esto creará la variable CSS
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-sans", // Y esta también
});

export const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-antica", // Variable para el título Antica
});
