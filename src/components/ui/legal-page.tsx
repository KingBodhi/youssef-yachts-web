import type { ReactNode } from "react";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";

interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  accentFrom?: number;
  lede: string;
  updated: string;
  sections: LegalSection[];
  children?: ReactNode;
}

/**
 * Shared shell for the policy pages so they inherit the same masthead, rhythm
 * and measure as the rest of the site rather than looking like an afterthought.
 */
export function LegalPage({
  eyebrow,
  title,
  accentFrom,
  lede,
  updated,
  sections,
  children,
}: LegalPageProps) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        accentFrom={accentFrom}
        lede={lede}
      />

      <Section space="tight" className="pt-0">
        <div className="mx-auto max-w-3xl">
          <p className="mb-12 text-sm text-muted/70">Last updated: {updated}</p>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                  {section.heading}
                </h2>
                <div className="mt-2 h-0.5 w-12 rounded-full bg-primary" />
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
                  {section.body.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {children}
        </div>
      </Section>
    </>
  );
}
