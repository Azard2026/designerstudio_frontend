import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KELEBEK DESIGNERS | Luxury Interior Design & Architectural Spaces",
  description:
    "KELEBEK DESIGNERS — Premium luxury interior design studio specializing in bespoke residential, commercial, modular kitchens, and architectural space transformations.",
  keywords: "Kelebek Designers, luxury interior design, interior design studio, modular kitchens, architectural spaces, luxury home renovation",
  openGraph: {
    title: "KELEBEK DESIGNERS — Interior Design & Spaces",
    description: "Bespoke luxury interior design, architectural planning, and space transformation studio.",
    type: "website",
  },
};

export const viewport: import("next").Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

