/**
 * Placeholder sample data. Places are real Bangkok spots, but descriptions are
 * our own and coordinates, prices and opening hours are approximate — verify
 * before publishing. Photos are local placeholders in /public/images/places.
 */
import type { OpeningPeriod, Place, Weekday } from "@/domain/entities";

const ALL_DAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

function hours(opens: string, closes: string, days: Weekday[] = ALL_DAYS): OpeningPeriod[] {
  return days.map((day) => ({ day, opens, closes }));
}

function photo(id: string, alt: string) {
  return { src: `/images/places/${id}.svg`, alt };
}

export const samplePlaces: Place[] = [
  // ---------- Restaurants ----------
  {
    id: "jay-fai",
    type: "restaurant",
    name: "Jay Fai",
    cuisine: "Thai street food",
    price: { kind: "level", level: 4 },
    featured: true,
    photo: photo("jay-fai", "Crab omelette cooked over a charcoal flame"),
    description:
      "A one-woman wok show famous for its fat, golden crab omelette and drunken noodles. Expect a long queue and street-food stools at fine-dining prices — it's worth it once.",
    location: {
      areaId: "rattanakosin",
      address: "327 Maha Chai Rd, Samran Rat, Phra Nakhon",
      lat: 13.7527,
      lng: 100.5047,
    },
    openingHours: hours("09:00", "19:00", [3, 4, 5, 6]),
  },
  {
    id: "thipsamai",
    type: "restaurant",
    name: "Thipsamai Pad Thai",
    cuisine: "Pad thai",
    price: { kind: "level", level: 1 },
    featured: false,
    photo: photo("thipsamai", "Pad thai wrapped in a thin egg net"),
    description:
      "The city's best-known pad thai, cooked over charcoal and wrapped in a paper-thin omelette. Pair it with a bottle of fresh-squeezed orange juice.",
    location: {
      areaId: "rattanakosin",
      address: "313 Maha Chai Rd, Samran Rat, Phra Nakhon",
      lat: 13.7526,
      lng: 100.5049,
    },
    openingHours: hours("09:00", "00:00"),
  },
  {
    id: "nai-ek-roll-noodles",
    type: "restaurant",
    name: "Nai Ek Roll Noodles",
    cuisine: "Chinese-Thai noodles",
    price: { kind: "level", level: 1 },
    featured: false,
    photo: photo("nai-ek-roll-noodles", "Bowl of rolled rice noodles in peppery broth"),
    description:
      "Peppery broth, rolled rice noodles and crispy pork belly in a busy Yaowarat shophouse. Fast, cheap and open late.",
    location: {
      areaId: "chinatown",
      address: "442 Yaowarat Soi 9, Samphanthawong",
      lat: 13.7406,
      lng: 100.5094,
    },
    openingHours: hours("08:00", "00:00"),
  },
  {
    id: "t-and-k-seafood",
    type: "restaurant",
    name: "T&K Seafood",
    cuisine: "Seafood",
    price: { kind: "level", level: 2 },
    featured: true,
    photo: photo("t-and-k-seafood", "Grilled prawns on a street-side table"),
    description:
      "Green-shirted waiters, plastic tables spilling onto the pavement and piles of grilled river prawns. The classic Chinatown night out.",
    location: {
      areaId: "chinatown",
      address: "49-51 Phadung Dao Rd, Samphanthawong",
      lat: 13.7397,
      lng: 100.5105,
    },
    openingHours: hours("16:30", "02:00"),
  },
  {
    id: "somtum-der",
    type: "restaurant",
    name: "Somtum Der",
    cuisine: "Isan",
    price: { kind: "level", level: 2 },
    featured: false,
    photo: photo("somtum-der", "Green papaya salad with sticky rice"),
    description:
      "Bright, punchy northeastern Thai — papaya salads pounded to order, grilled chicken and sticky rice — in a small, friendly room near Sala Daeng.",
    location: {
      areaId: "silom",
      address: "5/5 Sala Daeng Rd, Silom, Bang Rak",
      lat: 13.7279,
      lng: 100.5367,
    },
    openingHours: hours("11:00", "23:00"),
  },
  {
    id: "cabbages-and-condoms",
    type: "restaurant",
    name: "Cabbages & Condoms",
    cuisine: "Thai",
    price: { kind: "level", level: 2 },
    featured: false,
    photo: photo("cabbages-and-condoms", "Garden terrace strung with lanterns"),
    description:
      "A leafy garden restaurant with a cause: profits support community health programmes. Reliable Thai classics and a playful, one-of-a-kind décor.",
    location: {
      areaId: "sukhumvit",
      address: "6 Sukhumvit Soi 12, Khlong Toei",
      lat: 13.738,
      lng: 100.559,
    },
    openingHours: hours("11:00", "23:00"),
  },
  {
    id: "supanniga-eating-room",
    type: "restaurant",
    name: "Supanniga Eating Room",
    cuisine: "Modern Thai",
    price: { kind: "level", level: 3 },
    featured: true,
    photo: photo("supanniga-eating-room", "Plates of Thai dishes on a wooden table"),
    description:
      "Family recipes from Trat and Isan served in a calm, wood-panelled room. Try the slow-braised pork and the crab curry with betel leaves.",
    location: {
      areaId: "thonglor",
      address: "160/11 Sukhumvit Soi 55 (Thonglor), Watthana",
      lat: 13.73,
      lng: 100.5815,
    },
    openingHours: hours("11:30", "22:30"),
  },
  {
    id: "lay-lao",
    type: "restaurant",
    name: "Lay Lao",
    cuisine: "Isan seafood",
    price: { kind: "level", level: 2 },
    featured: false,
    photo: photo("lay-lao", "Fried fish and som tam on a blue table"),
    description:
      "Seaside Isan cooking in a breezy Ari townhouse: crispy fried fish, salted-egg som tam and cold beer. A favourite with locals.",
    location: {
      areaId: "ari-chatuchak",
      address: "65 Phahonyothin Soi 7 (Ari), Phaya Thai",
      lat: 13.7795,
      lng: 100.544,
    },
    openingHours: hours("11:00", "22:00"),
  },

  // ---------- Attractions ----------
  {
    id: "grand-palace",
    type: "attraction",
    name: "The Grand Palace",
    category: "Palace",
    price: { kind: "fee", amountThb: 500 },
    featured: true,
    photo: photo("grand-palace", "Golden spires of the Grand Palace"),
    description:
      "The former royal residence and home of the Emerald Buddha. Go at opening time to beat the heat, and dress modestly — shoulders and knees covered.",
    location: {
      areaId: "rattanakosin",
      address: "Na Phra Lan Rd, Phra Borom Maha Ratchawang, Phra Nakhon",
      lat: 13.75,
      lng: 100.4913,
    },
    openingHours: hours("08:30", "15:30"),
  },
  {
    id: "wat-pho",
    type: "attraction",
    name: "Wat Pho",
    category: "Temple",
    price: { kind: "fee", amountThb: 300 },
    featured: true,
    photo: photo("wat-pho", "The reclining Buddha's golden head"),
    description:
      "Home of the 46-metre reclining Buddha and the birthplace of traditional Thai massage. Quieter than the palace next door and just as beautiful.",
    location: {
      areaId: "rattanakosin",
      address: "2 Sanam Chai Rd, Phra Borom Maha Ratchawang, Phra Nakhon",
      lat: 13.7465,
      lng: 100.493,
    },
    openingHours: hours("08:00", "18:30"),
  },
  {
    id: "wat-traimit",
    type: "attraction",
    name: "Wat Traimit",
    category: "Temple",
    price: { kind: "fee", amountThb: 100 },
    featured: false,
    photo: photo("wat-traimit", "The solid-gold Buddha in a white marble hall"),
    description:
      "The Temple of the Golden Buddha, a five-tonne solid-gold statue rediscovered under plaster in 1955. A calm start to a Chinatown walk.",
    location: {
      areaId: "chinatown",
      address: "661 Charoen Krung Rd, Talat Noi, Samphanthawong",
      lat: 13.7378,
      lng: 100.5137,
    },
    openingHours: hours("08:00", "17:00"),
  },
  {
    id: "lumphini-park",
    type: "attraction",
    name: "Lumphini Park",
    category: "Park",
    price: { kind: "fee", amountThb: 0 },
    featured: false,
    photo: photo("lumphini-park", "Lake and city skyline in Lumphini Park"),
    description:
      "Bangkok's green lung: a lake with swan boats, open-air aerobics at dusk and monitor lizards lounging on the banks.",
    location: {
      areaId: "silom",
      address: "Rama IV Rd, Lumphini, Pathum Wan",
      lat: 13.731,
      lng: 100.5418,
    },
    openingHours: hours("04:30", "21:00"),
  },
  {
    id: "mahanakhon-skywalk",
    type: "attraction",
    name: "Mahanakhon SkyWalk",
    category: "Viewpoint",
    price: { kind: "fee", amountThb: 880 },
    featured: true,
    photo: photo("mahanakhon-skywalk", "Glass floor high above the city at sunset"),
    description:
      "A glass floor 314 metres above the city. Time your visit for sunset and stay as the lights come on.",
    location: {
      areaId: "silom",
      address: "114 Narathiwas Rd, Silom, Bang Rak",
      lat: 13.7233,
      lng: 100.5283,
    },
    openingHours: hours("10:00", "19:00"),
  },
  {
    id: "benjakitti-forest-park",
    type: "attraction",
    name: "Benjakitti Forest Park",
    category: "Park",
    price: { kind: "fee", amountThb: 0 },
    featured: false,
    photo: photo("benjakitti-forest-park", "Elevated walkway over wetland"),
    description:
      "Elevated skywalks wind through restored wetlands between Sukhumvit's towers. Best in the early morning or late afternoon.",
    location: {
      areaId: "sukhumvit",
      address: "Ratchadaphisek Rd, Khlong Toei",
      lat: 13.7302,
      lng: 100.5585,
    },
    openingHours: hours("05:00", "21:00"),
  },
  {
    id: "the-commons-thonglor",
    type: "attraction",
    name: "The Commons",
    category: "Community space",
    price: { kind: "fee", amountThb: 0 },
    featured: false,
    photo: photo("the-commons-thonglor", "Open-air terraces with cafés and plants"),
    description:
      "An open-air, multi-level hangout of cafés, food stalls and small shops — Thonglor's living room.",
    location: {
      areaId: "thonglor",
      address: "335 Thonglor Soi 17, Khlong Tan Nuea, Watthana",
      lat: 13.7375,
      lng: 100.5822,
    },
    openingHours: hours("08:00", "01:00"),
  },
  {
    id: "chatuchak-weekend-market",
    type: "attraction",
    name: "Chatuchak Weekend Market",
    category: "Market",
    price: { kind: "fee", amountThb: 0 },
    featured: true,
    photo: photo("chatuchak-weekend-market", "Rows of market stalls under tin roofs"),
    description:
      "Over 15,000 stalls of vintage, plants, ceramics and snacks. Arrive early, bring cash and pick a landmark to meet at.",
    location: {
      areaId: "ari-chatuchak",
      address: "Kamphaeng Phet 2 Rd, Chatuchak",
      lat: 13.7999,
      lng: 100.55,
    },
    openingHours: hours("09:00", "18:00", [0, 6]),
  },
];
