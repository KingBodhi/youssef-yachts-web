export const BRAND = {
  name: "Hurry Up Slowly Yachts",
  shortName: "Hurry Up Slowly",
  tagline: "Miami's Elite Yacht Charter Experience",
  description:
    "Premier luxury yacht charters in Miami. Handpicked vessels, professional crew, world-class service on Biscayne Bay, Star Island, and beyond.",
  contactName: "Youssef",
  phone: "(305) 555-0199",
  phoneHref: "+13055550199",
  email: "charter@hurryupslowly.com",
  address: "300 Alton Road, Miami Beach, FL 33139",
  location: "Miami Beach, FL",
  instagram: "https://instagram.com/hurryupslowly",
  facebook: "https://facebook.com/hurryupslowly",
  tiktok: "https://tiktok.com/@hurryupslowly",
  youtube: "https://youtube.com/@hurryupslowly",
} as const;

export const NAV_LINKS = [
  { label: "Fleet", href: "/fleet" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const CHARTER_TYPES = [
  { id: "half-day", label: "Half Day", duration: "4 Hours", description: "Perfect for sunset cruises and afternoon escapes" },
  { id: "full-day", label: "Full Day", duration: "8 Hours", description: "The complete Miami experience: sandbar, sightseeing, and more" },
  { id: "multi-day", label: "Multi-Day", duration: "Custom", description: "Extended voyages to the Keys, Bahamas, and beyond" },
] as const;

export const ADD_ONS = [
  { id: "chef", name: "Private Chef", price: 1500, icon: "chef-hat", description: "Gourmet dining prepared onboard by a professional chef" },
  { id: "dj", name: "DJ & Sound System", price: 800, icon: "music", description: "Premium sound system with a professional DJ" },
  { id: "photographer", name: "Photographer", price: 1200, icon: "camera", description: "Professional photography capturing every moment" },
  { id: "jet-ski", name: "Jet Ski", price: 200, icon: "waves", description: "Per jet ski, per hour. Minimum 2-hour rental" },
  { id: "water-toys", name: "Water Toys Package", price: 500, icon: "anchor", description: "Paddleboards, snorkeling gear, floats, and more" },
  { id: "decorations", name: "Custom Decorations", price: 600, icon: "sparkles", description: "Balloons, flowers, banners, tailored to your event" },
] as const;
