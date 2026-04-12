import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Antica",
  description: "Cafetería de especialidad y experiencias de degustación",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
