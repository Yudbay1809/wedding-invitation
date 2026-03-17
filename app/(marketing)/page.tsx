import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { TemplateShowcase } from "@/components/marketing/TemplateShowcase";
import { RsvpAnalyticsShowcase } from "@/components/marketing/RsvpAnalyticsShowcase";
import { Pricing } from "@/components/marketing/Pricing";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Faq } from "@/components/marketing/Faq";
import { Footer } from "@/components/marketing/Footer";

export default function MarketingPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 pb-24">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <TemplateShowcase />
      <RsvpAnalyticsShowcase />
      <Pricing />
      <Testimonials />
      <Faq />
      <Footer />
    </main>
  );
}
