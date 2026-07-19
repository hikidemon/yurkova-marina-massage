import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import ServicesSection from '@/components/ServicesSection'
import PromotionsSection from '@/components/PromotionsSection'
import TrainingSection from '@/components/TrainingSection'
import GallerySection from '@/components/GallerySection'
import CertificatesSection from '@/components/CertificatesSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <PromotionsSection />
        <TrainingSection />
        <GallerySection />
        <CertificatesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
