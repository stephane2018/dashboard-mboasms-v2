import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MboaSMS - Service d\'envoi de SMS au Cameroun',
  description: 'Plateforme d\'envoi de SMS professionnels au Cameroun avec API et services personnalisés pour entreprises et particuliers.',
  generator: 'Next.js',
  applicationName: 'MboaSMS',
  referrer: 'origin-when-cross-origin',
  keywords: ['SMS', 'Cameroun', 'API SMS', 'Marketing SMS', 'Envoi SMS', 'Bulk SMS', 'SMS Professionnel'],
  authors: [{ name: 'MboaSMS Team' }],
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1E1B24' },
  ],
  creator: 'MboaSMS',
  publisher: 'MboaSMS',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  metadataBase: new URL('https://mboasms.com'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-FR': '/fr',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'MboaSMS - Service d\'envoi de SMS au Cameroun',
    description: 'Plateforme d\'envoi de SMS professionnels au Cameroun avec API et services personnalisés.',
    url: 'https://mboasms.com',
    siteName: 'MboaSMS',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MboaSMS - Service d\'envoi de SMS au Cameroun',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MboaSMS - Service d\'envoi de SMS au Cameroun',
    description: 'Plateforme d\'envoi de SMS professionnels au Cameroun avec API et services personnalisés.',
    creator: '@mboasms',
    images: ['/images/twitter-image.jpg'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  category: 'technology',
};
