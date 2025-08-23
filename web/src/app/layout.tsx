import type { Metadata } from 'next';
import { Inter, DM_Sans } from 'next/font/google';
import './globals.css';
import Topbar from '@/components/Topbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'Mioro - Comparador de Precios de Metales Preciosos',
  description: 'Encuentra los mejores precios para oro, plata y platino en tu ciudad.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${dmSans.variable}`}>
      <body className="font-sans text-gray-700 antialiased bg-gray-50">
        <div className="min-h-screen flex flex-col">
          <Topbar />
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}