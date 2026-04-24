import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/core/providers/query-provider";
import { AuthProvider } from "@/core/providers/auth-provider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { SuppressScriptWarning } from "@/shared/components/suppress-script-warning"
import { ClientErrorReporter } from "@/shared/components/client-error-reporter";
import { OrganizationJsonLd, SoftwareApplicationJsonLd, WebSiteJsonLd, FAQJsonLd } from "@/shared/components/json-ld";
import { GoogleAnalytics } from "@/shared/components/google-analytics";
import { MetaPixel } from "@/shared/components/meta-pixel";
import '@/core/lib/i18n';

export { metadata } from "./metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <OrganizationJsonLd />
        <SoftwareApplicationJsonLd />
        <WebSiteJsonLd />
        <FAQJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        <MetaPixel />
        <SuppressScriptWarning />
        <ClientErrorReporter />
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster position="top-right" richColors />
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
