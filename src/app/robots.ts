import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hurryupslowly.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The admin console, the API and the signing flow have no business in
        // an index. The waiver page is reached from a tokenised link.
        disallow: ["/admin", "/admin/", "/api/", "/waiver", "/book/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
