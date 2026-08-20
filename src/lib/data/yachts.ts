import { Yacht } from "@/lib/types";

/**
 * Every yacht presents the same amount of content. These are the counts, and
 * `assertFleetUniformity()` below enforces them at module load in development
 * so a future edit cannot quietly reintroduce the drift this fixes: before
 * this pass, galleries ranged from 6 to 12 images and amenity lists from 10
 * to 12, which made the fleet look unevenly documented.
 */
export const FLEET_SHAPE = {
  minImages: 6,
  maxImages: 20,
  amenities: 10,
  includes: 6,
  features: 4,
} as const;

export const yachts: Yacht[] = [
  {
    id: "leopard-92",
    slug: "leopard-92-jacuzzi",
    name: "92' Leopard W/Jacuzzi & Club",
    tagline: "The Ultimate Miami Party Yacht",
    description:
      "The crown jewel of our fleet. This 92-foot Leopard is an unrivaled floating venue featuring an onboard jacuzzi, a private club area with premium sound and lighting, and three expansive deck levels. Whether you're hosting a corporate event, milestone celebration, or an unforgettable night on the water, this vessel delivers an experience that rivals the finest nightclubs and lounges in Miami. Accommodating up to 30 guests, she is the definitive choice for those who demand the extraordinary.",
    length: 92,
    capacity: 30,
    cabins: 5,
    crew: 4,
    builder: "Leopard",
    year: 2021,
    images: [
      "/yachts/leopard-92/01.jpg",
      "/yachts/leopard-92/02.jpg",
      "/yachts/leopard-92/03.jpg",
      "/yachts/leopard-92/04.jpg",
      "/yachts/leopard-92/05.jpg",
      "/yachts/leopard-92/06.jpg",
      "/yachts/leopard-92/07.jpg",
      "/yachts/leopard-92/08.jpg",
      "/yachts/leopard-92/09.jpg",
      "/yachts/leopard-92/10.jpg",
      "/yachts/leopard-92/11.jpg",
      "/yachts/leopard-92/12.jpg",
    ],
    thumbnail: "/yachts/leopard-92/thumb.jpg",
    amenities: [
      "Onboard Jacuzzi",
      "Private club area with DJ booth",
      "Premium LED lighting system",
      "JBL Professional sound system",
      "Flybridge with 360° views",
      "Hydraulic swim platform",
      "Full commercial galley",
      "VIP master suite",
      "Multiple bar stations",
      "Satellite TV & entertainment",
    ],
    includes: [
      "Captain & professional crew",
      "Fuel",
      "Ice, water & soft drinks",
      "Bluetooth audio",
      "Snorkeling gear",
      "Floating mat & noodles",
    ],
    pricing: { halfDay: 8000, fullDay: 14000, multiDayPerDay: 12000, currency: "USD" },
    availability: {
      operatingHours: { start: "08:00", end: "22:00" },
      blackoutDates: [],
      slots: [],
    },
    location: {
      marina: "Miami Beach Marina",
      address: "300 Alton Road",
      city: "Miami Beach",
      state: "FL",
      lat: 25.7701,
      lng: -80.1425,
      dockNumber: "D-12",
    },
    specs: {
      length: "92 ft",
      beam: "22 ft 6 in",
      draft: "6 ft 2 in",
      speed: "24 knots",
      fuelCapacity: "1,800 gal",
      waterCapacity: "400 gal",
    },
    features: [
      "Jacuzzi on the flybridge",
      "Club area with dance floor",
      "Professional DJ booth & lighting",
      "Three deck levels",
    ],
    status: "active",
  },
  // NOTE: specs & pricing PRELIMINARY. Confirm real values with owner.
  {
    id: "leopard-86",
    slug: "leopard-86",
    name: "86' Leopard",
    tagline: "Power, Elegance, Presence",
    description:
      "The 86-foot Leopard commands attention wherever she goes. With her sleek Italian-inspired lines, expansive sun deck, and meticulously appointed interior, she strikes the perfect balance between performance and luxury. Four staterooms below deck provide overnight comfort, while the open-plan main salon and flybridge create generous entertaining spaces. Ideal for sophisticated day charters, sunset cruises, and multi-day voyages to the Keys or Bahamas.",
    length: 86,
    capacity: 20,
    cabins: 4,
    crew: 3,
    builder: "Leopard",
    year: 2020,
    images: [
      "/yachts/leopard-86/01.jpg",
      "/yachts/leopard-86/02.jpg",
      "/yachts/leopard-86/03.jpg",
      "/yachts/leopard-86/04.jpg",
      "/yachts/leopard-86/05.jpg",
      "/yachts/leopard-86/06.jpg",
      "/yachts/leopard-86/07.jpg",
      "/yachts/leopard-86/08.jpg",
      "/yachts/leopard-86/09.jpg",
      "/yachts/leopard-86/10.jpg",
      "/yachts/leopard-86/11.jpg",
      "/yachts/leopard-86/12.jpg",
    ],
    thumbnail: "/yachts/leopard-86/thumb.jpg",
    amenities: [
      "Expansive flybridge with wet bar",
      "Bow sunpad lounge",
      "Hydraulic swim platform",
      "Bose surround sound system",
      "Stabilizers at anchor",
      "Water toys storage bay",
      "Full galley kitchen",
      "Satellite TV in all cabins",
      "LED underwater lights",
      "Tender & jet ski garage",
    ],
    includes: [
      "Captain & professional crew",
      "Fuel",
      "Ice, water & soft drinks",
      "Bluetooth audio",
      "Snorkeling gear",
      "Beach towels",
    ],
    pricing: { halfDay: 6000, fullDay: 10000, multiDayPerDay: 8500, currency: "USD" },
    availability: {
      operatingHours: { start: "08:00", end: "20:00" },
      blackoutDates: [],
      slots: [],
    },
    location: {
      marina: "Miami Beach Marina",
      address: "300 Alton Road",
      city: "Miami Beach",
      state: "FL",
      lat: 25.7701,
      lng: -80.1425,
      dockNumber: "D-14",
    },
    specs: {
      length: "86 ft",
      beam: "20 ft 4 in",
      draft: "5 ft 10 in",
      speed: "26 knots",
      fuelCapacity: "1,400 gal",
      waterCapacity: "320 gal",
    },
    features: [
      "Expansive sun deck",
      "Jet ski garage",
      "Overnight capability",
      "Full entertainment system",
    ],
    status: "active",
  },
  // NOTE: specs & pricing PRELIMINARY. Confirm real values with owner.
  {
    id: "leopard-82",
    slug: "leopard-82",
    name: "82' Leopard Sport Yacht",
    tagline: "Speed and Style on Biscayne Bay",
    description:
      "The 82-foot Leopard is a true Italian sport yacht, all sleek lines and effortless speed. Her signature low profile and red racing stripe make her one of the most striking silhouettes on the water. The expansive teak flybridge is built for sun-soaked days and golden-hour cruising, with generous lounging, a wet bar, and panoramic views in every direction. Fast, agile, and endlessly photogenic, she is the perfect choice for sunset charters, sandbar afternoons, and making an entrance wherever the day takes you.",
    length: 82,
    capacity: 12,
    cabins: 2,
    crew: 2,
    builder: "Leopard",
    year: 2016,
    images: [
      "/yachts/leopard-82/01.jpg",
      "/yachts/leopard-82/02.jpg",
      "/yachts/leopard-82/03.jpg",
      "/yachts/leopard-82/04.jpg",
      "/yachts/leopard-82/05.jpg",
      "/yachts/leopard-82/06.jpg",
      "/yachts/leopard-82/07.jpg",
      "/yachts/leopard-82/08.jpg",
      "/yachts/leopard-82/09.jpg",
      "/yachts/leopard-82/10.jpg",
      "/yachts/leopard-82/11.jpg",
      "/yachts/leopard-82/12.jpg",
    ],
    thumbnail: "/yachts/leopard-82/thumb.jpg",
    amenities: [
      "Expansive teak flybridge",
      "Flybridge wet bar",
      "Bow sunpad lounge",
      "Hydraulic swim platform",
      "Premium sound system",
      "Sun-deck dining",
      "Water toys storage",
      "LED underwater lights",
      "Shaded flybridge lounge",
      "High-speed cruising",
    ],
    includes: [
      "Captain & professional crew",
      "Fuel",
      "Ice, water & soft drinks",
      "Bluetooth audio",
      "Snorkeling gear",
      "Beach towels",
    ],
    pricing: { halfDay: 5000, fullDay: 8500, multiDayPerDay: 7500, currency: "USD" },
    availability: {
      operatingHours: { start: "08:00", end: "20:00" },
      blackoutDates: [],
      slots: [],
    },
    location: {
      marina: "Miami Beach Marina",
      address: "300 Alton Road",
      city: "Miami Beach",
      state: "FL",
      lat: 25.7701,
      lng: -80.1425,
      dockNumber: "D-18",
    },
    specs: {
      length: "82 ft",
      beam: "20 ft",
      draft: "4 ft 6 in",
      speed: "38 knots",
      fuelCapacity: "1,300 gal",
      waterCapacity: "260 gal",
    },
    features: [
      "Italian sport-yacht styling",
      "Top speed of 38 knots",
      "Expansive teak flybridge",
      "Built for golden-hour cruising",
    ],
    status: "active",
  },
  {
    id: "princess-v65",
    slug: "princess-v65",
    name: "67' Princess V65",
    tagline: "British Craftsmanship, Miami Style",
    description:
      "The Princess V65 is a masterwork of British naval architecture refined for Miami's waters. Her aggressive yet elegant lines conceal three luxurious staterooms, a hand-finished salon, and a cockpit designed for effortless entertaining. The retractable hardtop transforms the main deck from an open-air paradise to a sheltered lounge at the touch of a button. With a top speed of 34 knots, she can whisk you from downtown Miami to Bimini in under three hours.",
    length: 67,
    capacity: 13,
    cabins: 3,
    crew: 2,
    builder: "Princess",
    year: 2022,
    images: [
      "/yachts/princess-v65/01.jpg",
      "/yachts/princess-v65/02.jpg",
      "/yachts/princess-v65/03.jpg",
      "/yachts/princess-v65/04.jpg",
      "/yachts/princess-v65/05.jpg",
      "/yachts/princess-v65/06.jpg",
      "/yachts/princess-v65/07.jpg",
      "/yachts/princess-v65/08.jpg",
      "/yachts/princess-v65/09.jpg",
      "/yachts/princess-v65/10.jpg",
      "/yachts/princess-v65/11.jpg",
      "/yachts/princess-v65/12.jpg",
    ],
    thumbnail: "/yachts/princess-v65/thumb.jpg",
    amenities: [
      "Retractable hardtop",
      "Cockpit wet bar & grill",
      "Teak-laid cockpit deck",
      "JL Audio premium sound system",
      "Garmin navigation suite",
      "LED underwater lights",
      "Electric sunroof",
      "Bow sunpad with cushions",
      "Full galley",
      "Tender garage",
    ],
    includes: [
      "Captain & crew",
      "Fuel",
      "Ice, water & soft drinks",
      "Bluetooth audio",
      "Snorkeling gear",
      "Beach towels",
    ],
    pricing: { halfDay: 4000, fullDay: 7000, multiDayPerDay: 6000, currency: "USD" },
    availability: {
      operatingHours: { start: "08:00", end: "20:00" },
      blackoutDates: [],
      slots: [],
    },
    location: {
      marina: "Miami Beach Marina",
      address: "300 Alton Road",
      city: "Miami Beach",
      state: "FL",
      lat: 25.7701,
      lng: -80.1425,
      dockNumber: "D-08",
    },
    specs: {
      length: "66 ft 8 in",
      beam: "16 ft 9 in",
      draft: "4 ft 11 in",
      speed: "34 knots",
      fuelCapacity: "845 gal",
      waterCapacity: "185 gal",
    },
    features: [
      "Retractable hardtop",
      "High-performance hull",
      "Overnight to Bahamas",
      "Hand-finished interior",
    ],
    status: "active",
  },
  {
    id: "cantius-45",
    slug: "cantius-45",
    name: "45' Cruisers Cantius",
    tagline: "The Perfect Day on the Water",
    description:
      "The Cruisers Cantius 45 is the ultimate Miami day boat. American-built with meticulous attention to detail, she features an innovative open-concept layout where the salon, galley, and cockpit merge into one seamless entertaining space. The retractable sunroof and fold-down bulwark windows erase the line between indoors and out. Below deck, a private stateroom and a beautifully finished head with separate shower provide all the comforts of home. Equipped with a sea pool, floating lily pad, and water mat, she is purpose-built for sandbar days, sunset cruises, and intimate gatherings on the turquoise waters of Biscayne Bay.",
    length: 45,
    capacity: 12,
    cabins: 1,
    crew: 1,
    builder: "Cruisers Yachts",
    year: 2023,
    images: [
      "/yachts/cantius-45/01.jpg",
      "/yachts/cantius-45/02.jpg",
      "/yachts/cantius-45/03.jpg",
      "/yachts/cantius-45/04.jpg",
      "/yachts/cantius-45/05.jpg",
      "/yachts/cantius-45/06.jpg",
      "/yachts/cantius-45/07.jpg",
      "/yachts/cantius-45/08.jpg",
      "/yachts/cantius-45/09.jpg",
      "/yachts/cantius-45/10.jpg",
      "/yachts/cantius-45/11.jpg",
      "/yachts/cantius-45/12.jpg",
    ],
    thumbnail: "/yachts/cantius-45/thumb.jpg",
    amenities: [
      "Retractable sunroof",
      "Fold-down bulwark windows",
      "Aft cockpit with teak table",
      "Full galley with microwave & fridge",
      "Premium Fusion sound system",
      "Bow sunpad lounge",
      "Walnut interior finish",
      "Glass-enclosed head with shower",
      "Swim platform with ladder",
      "LED underwater lights",
    ],
    includes: [
      "Captain",
      "Fuel",
      "Ice, water & soft drinks",
      "Bluetooth audio",
      "Sea pool, floating mat & lily pad",
      "Snorkeling gear",
    ],
    pricing: { halfDay: 2200, fullDay: 3800, multiDayPerDay: 3200, currency: "USD" },
    availability: {
      operatingHours: { start: "08:00", end: "20:00" },
      blackoutDates: [],
      slots: [],
    },
    location: {
      marina: "Miami Beach Marina",
      address: "300 Alton Road",
      city: "Miami Beach",
      state: "FL",
      lat: 25.7701,
      lng: -80.1425,
      dockNumber: "D-06",
    },
    specs: {
      length: "45 ft",
      beam: "14 ft 3 in",
      draft: "3 ft 9 in",
      speed: "30 knots",
      fuelCapacity: "400 gal",
      waterCapacity: "80 gal",
    },
    features: [
      "Sea pool & floating lily pad included",
      "Open-concept indoor/outdoor layout",
      "Retractable sunroof",
      "Premium walnut interior",
    ],
    status: "active",
  },
];

export function getYachtBySlug(slug: string): Yacht | undefined {
  return yachts.find((y) => y.slug === slug);
}

export function getYachtById(id: string): Yacht | undefined {
  return yachts.find((y) => y.id === id);
}

export function getActiveYachts(): Yacht[] {
  return yachts.filter((y) => y.status === "active");
}

/**
 * Fails loudly in development if any yacht drifts from FLEET_SHAPE. A rule
 * that lives only in a comment is a rule nobody enforces.
 */
function assertFleetUniformity(list: Yacht[]): void {
  const problems: string[] = [];

  for (const y of list) {
    if (
      y.images.length < FLEET_SHAPE.minImages ||
      y.images.length > FLEET_SHAPE.maxImages
    ) {
      problems.push(
        `${y.name}: ${y.images.length} images, expected ${FLEET_SHAPE.minImages}-${FLEET_SHAPE.maxImages}`
      );
    }
    if (y.amenities.length !== FLEET_SHAPE.amenities) {
      problems.push(`${y.name}: ${y.amenities.length} amenities, expected ${FLEET_SHAPE.amenities}`);
    }
    if (y.includes.length !== FLEET_SHAPE.includes) {
      problems.push(`${y.name}: ${y.includes.length} includes, expected ${FLEET_SHAPE.includes}`);
    }
    if ((y.features?.length ?? 0) !== FLEET_SHAPE.features) {
      problems.push(`${y.name}: ${y.features?.length ?? 0} features, expected ${FLEET_SHAPE.features}`);
    }
    const bad = y.images.filter((src) => !/\/\d{2}\.jpg$/.test(src));
    if (bad.length > 0) {
      problems.push(`${y.name}: gallery images must be numbered 01..06.jpg (${bad.join(", ")})`);
    }
    if (!y.thumbnail.endsWith("/thumb.jpg")) {
      problems.push(`${y.name}: thumbnail must be thumb.jpg (${y.thumbnail})`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`Fleet data is not uniform:\n  ${problems.join("\n  ")}`);
  }
}

if (process.env.NODE_ENV !== "production") {
  assertFleetUniformity(yachts);
}
