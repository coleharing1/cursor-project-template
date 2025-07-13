import { getSession } from '@/lib/supabaseClient'
import { LandingHeader } from '@/components/landing/landing-header'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorksSection } from '@/components/landing/how-it-works'
import { TestimonialsSection } from '@/components/landing/testimonials'
import { CtaSection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'

export default async function Home() {
  const session = await getSession()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <LandingHeader session={session} />
      <main className="container flex flex-col gap-24 sm:gap-32 md:gap-48">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}