
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
// import { AuthProvider } from '@/components/auth/auth-provider'; // Assuming this will be created
// import AppHeader from '@/components/layout/AppHeader'; // Assuming this will be created
import { ThemeProvider } from '@/components/theme-provider';
import FloatingActionButton from '@/components/custom/floating-action-button';
import dynamic from 'next/dynamic';

const InvestmentFabClientOnly = dynamic(
  () => import('@/components/custom/investment-fab'),
  { ssr: false }
);

// Placeholder for AppHeader - will be created later if requested
const AppHeader = () => (
  <header className="bg-background text-foreground p-4 shadow-md h-16">
    {/* Placeholder content */}
  </header>
);

// Placeholder for AuthProvider - will be created later if requested
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
  title: 'RideShare DriverAds',
  description: 'Connects passengers with drivers, monetized by ads for drivers.',
  // Keeping Deyconic specific metadata for now, can be updated if needed
  keywords: ['Deyconic', 'innovación digital', 'startups RD', 'transformación digital', 'gestión de proyectos RD', 'empresas que desarrollan páginas web', 'empresa de diseño web', 'gestión empresarial', 'crear páginas web'],
  authors: [{ name: 'Deyconic' }], // Assuming Deyconic is still the author
  icons: {
    icon: lightLogoUrl,
    shortcut: lightLogoUrl,
    apple: lightLogoUrl,
  },
  openGraph: {
    title: 'Deyconic', // Keeping Deyconic OG data
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-secondary`}>
        <AuthProvider>
          <AppHeader />
          <main className="min-h-[calc(100vh-4rem)]"> {/* Adjust 4rem based on AppHeader height */}
            {children}
          </main>
          <Toaster />
          {/* Removed FloatingActionButton and InvestmentFabClientOnly as per new layout structure implicitly */}
          {/* Adding them back as AuthProvider is currently a wrapper for ThemeProvider */}
          <FloatingActionButton />
          <InvestmentFabClientOnly />
        </AuthProvider>
      </body>
    </html>
  );
}
