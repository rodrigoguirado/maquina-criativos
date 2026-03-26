import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Máquina de Criativos — Seazone",
  description: "Geração autônoma de criativos de marketing com IA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
