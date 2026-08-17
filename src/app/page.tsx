import { HeroSection } from "@/components/home/hero-section";
import { FleetPreview } from "@/components/home/fleet-preview";
import { DestinationsBand } from "@/components/home/destinations-band";
import { ShowcaseSection } from "@/components/home/showcase-section";
import { ExperienceSection } from "@/components/home/experience-section";
import { SignatureExperiences } from "@/components/home/signature-section";
import { CtaSection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FleetPreview />
      <DestinationsBand />
      <ShowcaseSection />
      <ExperienceSection />
      <SignatureExperiences />
      <CtaSection />
    </>
  );
}
