import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero-section";
import StatsSection from "@/components/sections/stats-section";
import AboutSection from "@/components/sections/about-section";
import MissionSection from "@/components/sections/mission-section";
import ServicesSection from "@/components/sections/services-section";
import PortfolioSection from "@/components/sections/portfolio-section";
import LiveSection from "@/components/sections/live-section";
import NewsSection from "@/components/sections/news-section";
import UpdatesSection from "@/components/sections/updates-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <MissionSection />
        <ServicesSection />
        <PortfolioSection />
        <LiveSection />
        <NewsSection />
        <UpdatesSection />
      </main>
      <Footer />
    </div>
  );
}
