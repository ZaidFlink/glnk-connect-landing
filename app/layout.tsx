import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']
});

export const metadata: Metadata = {
  title: 'Connect | Enterprise Healthcare Network',
  description: 'Connect links healthcare professionals worldwide, enabling collaboration, knowledge sharing, and career advancement.',
  keywords: ['healthcare network', 'medical professionals', 'healthcare collaboration', 'medical community'],
  authors: [{ name: 'Connect Team' }],
  openGraph: {
    title: 'Connect | Enterprise Healthcare Network',
    description: 'Connect links healthcare professionals worldwide, enabling collaboration, knowledge sharing, and career advancement.',
    url: 'https://connect-plus.vercel.app',
    siteName: 'Connect',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Connect | Enterprise Healthcare Network',
    description: 'Connect links healthcare professionals worldwide, enabling collaboration, knowledge sharing, and career advancement.',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
} 