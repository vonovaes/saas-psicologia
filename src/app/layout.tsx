import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acolha",
  description: "Presença digital e captação de contatos para psicólogos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <NextTopLoader color="#245847" showSpinner={false} height={3} />
        {children}
      </body>
    </html>
  );
}
