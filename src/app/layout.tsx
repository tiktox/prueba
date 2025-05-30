import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
// import { AuthProvider } from '@/components/auth/auth-provider'; // Assuming this will be created
// import AppHeader from '@/components/layout/AppHeader'; // Assuming this will be created
import { ThemeProvider } from '@/components/theme-provider';
import FloatingActionButtonWrapper from '@/components/custom/floating-action-button-wrapper';
import InvestmentFabWrapper from '@/components/custom/investment-fab-wrapper';
// Removed: import ServiceRequestFabWrapper from '@/components/custom/service-request-fab-wrapper';


// Placeholder for AppHeader - will be created later if requested
const AppHeader = () => (
  <header className="bg-background text-foreground p-4 shadow-md h-16">
    {/* Placeholder content */}
  </header>
);

// Placeholder for AuthProvider - will be created later if requested
// The current AuthProvider is effectively ThemeProvider
const AuthProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    {children}
  </ThemeProvider>
);


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const lightLogoUrl = "https://ik.imagekit.io/ajkl5a98u/logo_1000x1000-removebg-preview.png?updatedAt=1746469003137";


export const metadata: Metadata = {
  title: 'Deyconic',
  description: 'Deyconic es una institución que ofrece servicios digitales y fisicos a empresas que no tienen presencia en redes sociales o no cuentan con una plataforma profesional que los posicione en los motores de busqueda, nuestro objetivo es lograr el impulso digital para pequeñas y grandes empresas y mejorar la interacción empresarial con el cliente. Nuestro equipo de expertos fusiona creatividad y tecnología para potenciar el crecimiento de tu negocio, ya sea en el ámbito digital o físico, alcanzando el máximo nivel de desarrollo empresarial para tu organización.',
  keywords: ['Deyconic', 'innovación digital', 'startups RD', 'transformación digital', 'gestión de proyectos RD', 'empresas que desarrollan páginas web', 'empresa de diseño web', 'gestión empresarial', 'crear páginas web'],
  authors: [{ name: 'Deyconic' }],
  icons: {
    icon: lightLogoUrl,
    shortcut: lightLogoUrl,
    apple: lightLogoUrl,
  },
  openGraph: {
    title: 'Deyconic',
    description: 'Empresa líder en desarrollo web y gestión empresarial.',
    url: 'https://deyconic.vercel.app/',
    images: [
      {
        url: 'https://scontent.fhex5-2.fna.fbcdn.net/v/t1.15752-9/482169794_889373686528908_3990815244860795325_n.jpg?stp=dst-jpg_s480x480_tt6&_nc_cat=103&ccb=1-7&_nc_sid=0024fc&_nc_ohc=pfyFlYadTWkQ7kNvgGMOWao&_nc_oc=Adg4QyURi-L8KPZ37qG0ulpQT7I30adsoJOtcWF6LD51Ie4C8wHT0LBXZzl854zaOVpl8p0u6G4tEmXMR5ieLD1l&_nc_ad=z-m&_nc_cid=1468&_nc_zt=23&_nc_ht=scontent.fhex5-2.fna&oh=03_Q7cD1wFrl0-r6THSgCpXsAxxCbye-RSj5rB3eLfceKnv5cvnLA&oe=67F6D578',
        width: 480,
        height: 480,
        alt: 'Deyconic Logo',
      },
    ],
    siteName: 'Deyconic',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deyconic',
    description: 'Empresa líder en desarrollo web y gestión empresarial.',
    images: ['https://deyconic.vercel.app/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-secondary`}>
        <AuthProvider>
          {/* <AppHeader /> */} {/* Temporarily commenting out as it's a placeholder */}
          <main className="min-h-[calc(100vh-0rem)]"> {/* Adjust 4rem based on AppHeader height, using 0 for now */}
            {children}
          </main>
          <Toaster />
          <FloatingActionButtonWrapper />
          <InvestmentFabWrapper /> 
          {/* Removed: <ServiceRequestFabWrapper /> */}
        </AuthProvider>
      </body>
    </html>
  );
}
