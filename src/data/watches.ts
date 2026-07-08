/**
 * Aria's Atelier — catalogue
 *
 * Prices are approximate manufacturer recommended retail (MSRP) figures in USD
 * for the referenced models; boutique availability and final pricing vary.
 * Dial styling drives the parametric <WatchDial /> renderer.
 */

export type DialStyle = {
  /** Dial face base colour */
  dial: string;
  /** Secondary dial colour for the radial sheen */
  dialEdge: string;
  /** Bezel / case ring */
  ring: string;
  /** Hour + minute hands */
  hand: string;
  /** Hour markers */
  marker: string;
  /** Seconds hand accent */
  accent: string;
  /** true when the dial is light and needs darker detailing */
  light?: boolean;
};

export type Watch = {
  id: string;
  brandId: BrandId;
  name: string;
  reference: string;
  price: number;
  tagline: string; // e.g. "Swiss Made · Automatic"
  blurb: string;
  specs: {
    case: string;
    movement: string;
    water: string;
    bracelet: string;
  };
  dialStyle: DialStyle;
};

export type BrandId =
  | "rolex"
  | "omega"
  | "audemars-piguet"
  | "cartier"
  | "patek-philippe"
  | "jaeger-lecoultre";

export type Brand = {
  id: BrandId;
  name: string;
  monogram: string;
  since: string;
  line: string; // short descriptor
};

export const brands: Brand[] = [
  { id: "rolex", name: "Rolex", monogram: "R", since: "1905", line: "Oyster Perpetual excellence since 1905" },
  { id: "omega", name: "Omega", monogram: "O", since: "1848", line: "Precision born of space and sea" },
  { id: "audemars-piguet", name: "Audemars Piguet", monogram: "A", since: "1875", line: "Icons of Le Brassus since 1875" },
  { id: "cartier", name: "Cartier", monogram: "C", since: "1847", line: "The jeweller of kings since 1847" },
  { id: "patek-philippe", name: "Patek Philippe", monogram: "P", since: "1839", line: "Geneva's grand tradition since 1839" },
  { id: "jaeger-lecoultre", name: "Jaeger-LeCoultre", monogram: "J", since: "1833", line: "The watchmaker of watchmakers" },
];

export const brandById = (id: string) => brands.find((b) => b.id === id);

/* ---- dial presets -------------------------------------------------------- */
const gold = "#c9a961";
const goldSoft = "#e3c887";

const green: DialStyle = { dial: "#0d3b2b", dialEdge: "#04140e", ring: gold, hand: goldSoft, marker: goldSoft, accent: "#e9d9a6" };
const navy: DialStyle = { dial: "#16304f", dialEdge: "#08111f", ring: gold, hand: goldSoft, marker: goldSoft, accent: "#e9d9a6" };
const charcoal: DialStyle = { dial: "#1a1712", dialEdge: "#0a0806", ring: gold, hand: goldSoft, marker: goldSoft, accent: "#e9d9a6" };
const oxblood: DialStyle = { dial: "#3a1712", dialEdge: "#160603", ring: gold, hand: goldSoft, marker: goldSoft, accent: "#e9d9a6" };
const teal: DialStyle = { dial: "#0f3b3a", dialEdge: "#041413", ring: gold, hand: goldSoft, marker: goldSoft, accent: "#e9d9a6" };
const slate: DialStyle = { dial: "#2a3138", dialEdge: "#12161a", ring: gold, hand: goldSoft, marker: goldSoft, accent: "#e9d9a6" };
const cream: DialStyle = { dial: "#e9e2d0", dialEdge: "#cdc3a9", ring: gold, hand: "#3a2f1a", marker: "#5a4a29", accent: "#8a6d2f", light: true };
const silver: DialStyle = { dial: "#d6d3cb", dialEdge: "#b3afa4", ring: gold, hand: "#33302a", marker: "#4a463d", accent: "#8a6d2f", light: true };
const champagne: DialStyle = { dial: "#d9c48a", dialEdge: "#b79d5c", ring: gold, hand: "#3a2f16", marker: "#4f3f1c", accent: "#6b5626", light: true };

export const watches: Watch[] = [
  /* -------------------------------- ROLEX -------------------------------- */
  {
    id: "rolex-submariner-date",
    brandId: "rolex",
    name: "Submariner Date",
    reference: "126610LV",
    price: 11350,
    tagline: "Swiss Made · Automatic",
    blurb:
      "The reference diver's watch. Born in 1953, the Submariner set the standard by which all dive watches are measured — and this green-bezel edition wears its heritage with quiet confidence.",
    specs: { case: "41 mm · Oystersteel", movement: "Calibre 3235 · Automatic", water: "300 m / 1,000 ft", bracelet: "Oyster · Oysterlock clasp" },
    dialStyle: green,
  },
  {
    id: "rolex-cosmograph-daytona",
    brandId: "rolex",
    name: "Cosmograph Daytona",
    reference: "126500LN",
    price: 15100,
    tagline: "Swiss Made · Chronograph",
    blurb:
      "Conceived for endurance racing, the Daytona is a study in tenths of a second. The tachymetric scale and three counters make it the most coveted chronograph in the world.",
    specs: { case: "40 mm · Oystersteel", movement: "Calibre 4131 · Automatic", water: "100 m / 330 ft", bracelet: "Oyster · Oysterlock clasp" },
    dialStyle: charcoal,
  },
  {
    id: "rolex-datejust-41",
    brandId: "rolex",
    name: "Datejust 41",
    reference: "126334",
    price: 9150,
    tagline: "Swiss Made · Automatic",
    blurb:
      "The archetype of the classic watch. Since 1945 the Datejust has defined the codes of elegance, its fluted bezel and Cyclops date as recognisable as a signature.",
    specs: { case: "41 mm · Oystersteel & white gold", movement: "Calibre 3235 · Automatic", water: "100 m / 330 ft", bracelet: "Jubilee · Oysterclasp" },
    dialStyle: navy,
  },
  {
    id: "rolex-gmt-master-ii",
    brandId: "rolex",
    name: "GMT-Master II",
    reference: "126710BLRO",
    price: 11350,
    tagline: "Swiss Made · Automatic",
    blurb:
      "Designed for pilots crossing the world's meridians, the two-tone Cerachrom bezel tracks a second time zone at a glance. A tool watch that became an icon.",
    specs: { case: "40 mm · Oystersteel", movement: "Calibre 3285 · Automatic", water: "100 m / 330 ft", bracelet: "Jubilee · Oysterclasp" },
    dialStyle: charcoal,
  },
  {
    id: "rolex-day-date-40",
    brandId: "rolex",
    name: "Day-Date 40",
    reference: "228238",
    price: 44850,
    tagline: "Swiss Made · Automatic",
    blurb:
      "The watch of presidents. Struck in 18 ct yellow gold, it was the first wristwatch to spell the day of the week in full — worn by those who set the hour rather than keep it.",
    specs: { case: "40 mm · 18 ct yellow gold", movement: "Calibre 3255 · Automatic", water: "100 m / 330 ft", bracelet: "President · Crownclasp" },
    dialStyle: champagne,
  },
  {
    id: "rolex-oyster-perpetual-41",
    brandId: "rolex",
    name: "Oyster Perpetual 41",
    reference: "124300",
    price: 6150,
    tagline: "Swiss Made · Automatic",
    blurb:
      "The purest expression of the Oyster. No date, no complication — only the essentials, rendered with the precision that made Rolex a superlative chronometer.",
    specs: { case: "41 mm · Oystersteel", movement: "Calibre 3230 · Automatic", water: "100 m / 330 ft", bracelet: "Oyster · Oysterclasp" },
    dialStyle: slate,
  },

  /* -------------------------------- OMEGA -------------------------------- */
  {
    id: "omega-speedmaster-moonwatch",
    brandId: "omega",
    name: "Speedmaster Moonwatch",
    reference: "310.30.42.50.01.002",
    price: 7000,
    tagline: "Swiss Made · Chronograph",
    blurb:
      "The first watch worn on the Moon. Flight-qualified by NASA in 1965, the Moonwatch remains hand-wound, legible and utterly without pretence.",
    specs: { case: "42 mm · Stainless steel", movement: "Calibre 3861 · Manual", water: "50 m / 165 ft", bracelet: "Steel bracelet · Hesalite" },
    dialStyle: charcoal,
  },
  {
    id: "omega-seamaster-diver-300m",
    brandId: "omega",
    name: "Seamaster Diver 300M",
    reference: "210.30.42.20.03.001",
    price: 6400,
    tagline: "Swiss Made · Automatic",
    blurb:
      "The diver with a cinematic pedigree. Wave-patterned lacquer, a skeleton dive hand and a Co-Axial Master Chronometer movement resistant to magnetism.",
    specs: { case: "42 mm · Stainless steel", movement: "Calibre 8800 · Automatic", water: "300 m / 1,000 ft", bracelet: "Steel bracelet" },
    dialStyle: navy,
  },
  {
    id: "omega-speedmaster-57",
    brandId: "omega",
    name: "Speedmaster '57",
    reference: "332.10.41.51.10.001",
    price: 9300,
    tagline: "Swiss Made · Chronograph",
    blurb:
      "A tribute to the 1957 original. Straight lugs, broad-arrow hands and a symmetrical two-counter layout powered by a co-axial column-wheel chronograph.",
    specs: { case: "40.5 mm · Stainless steel", movement: "Calibre 9906 · Automatic", water: "50 m / 165 ft", bracelet: "Steel bracelet" },
    dialStyle: green,
  },
  {
    id: "omega-constellation",
    brandId: "omega",
    name: "Constellation",
    reference: "131.10.39.20.06.001",
    price: 5900,
    tagline: "Swiss Made · Automatic",
    blurb:
      "The griffes and the star. First launched in 1952, the Constellation pairs an observatory-grade heritage with a jeweller's attention to case and bracelet.",
    specs: { case: "39 mm · Stainless steel", movement: "Calibre 8900 · Automatic", water: "100 m / 330 ft", bracelet: "Steel bracelet" },
    dialStyle: silver,
  },
  {
    id: "omega-aqua-terra-150m",
    brandId: "omega",
    name: "Seamaster Aqua Terra",
    reference: "220.10.41.21.03.004",
    price: 6300,
    tagline: "Swiss Made · Automatic",
    blurb:
      "Equally at ease on the deck and in the drawing room. The teak-patterned dial nods to luxury yacht decking; the movement is anti-magnetic to 15,000 gauss.",
    specs: { case: "41 mm · Stainless steel", movement: "Calibre 8900 · Automatic", water: "150 m / 500 ft", bracelet: "Steel bracelet" },
    dialStyle: teal,
  },
  {
    id: "omega-de-ville-tresor",
    brandId: "omega",
    name: "De Ville Trésor",
    reference: "435.13.40.21.02.001",
    price: 6600,
    tagline: "Swiss Made · Manual",
    blurb:
      "Slim, dressy and quietly modern. The Trésor revives a 1949 line with a domed dial, wire lugs and a hand-wound Master Chronometer calibre.",
    specs: { case: "40 mm · Stainless steel", movement: "Calibre 8910 · Manual", water: "30 m / 100 ft", bracelet: "Leather strap" },
    dialStyle: silver,
  },

  /* ---------------------------- AUDEMARS PIGUET -------------------------- */
  {
    id: "ap-royal-oak-selfwinding-41",
    brandId: "audemars-piguet",
    name: "Royal Oak Selfwinding 41",
    reference: "15510ST",
    price: 35300,
    tagline: "Swiss Made · Automatic",
    blurb:
      "Gérald Genta's 1972 revolution. The octagonal bezel, exposed screws and Grande Tapisserie dial made stainless steel a luxury proposition — and never looked back.",
    specs: { case: "41 mm · Stainless steel", movement: "Calibre 4302 · Automatic", water: "50 m / 165 ft", bracelet: "Integrated steel bracelet" },
    dialStyle: navy,
  },
  {
    id: "ap-royal-oak-offshore-chronograph",
    brandId: "audemars-piguet",
    name: "Royal Oak Offshore Chrono",
    reference: "26238ST",
    price: 44900,
    tagline: "Swiss Made · Chronograph",
    blurb:
      "The Royal Oak, amplified. Bolder proportions, a Méga Tapisserie dial and a rubber-clad crown gave the Offshore its reputation as the connoisseur's sports chronograph.",
    specs: { case: "42 mm · Stainless steel", movement: "Calibre 4401 · Automatic", water: "100 m / 330 ft", bracelet: "Integrated steel bracelet" },
    dialStyle: charcoal,
  },
  {
    id: "ap-royal-oak-jumbo-extra-thin",
    brandId: "audemars-piguet",
    name: "Royal Oak 'Jumbo' Extra-Thin",
    reference: "16202ST",
    price: 54900,
    tagline: "Swiss Made · Automatic",
    blurb:
      "The purist's Royal Oak. A faithful 39 mm continuation of the 1972 original — 'Petite Tapisserie' dial, blued screws and a movement just 3.05 mm thick.",
    specs: { case: "39 mm · Stainless steel", movement: "Calibre 7121 · Automatic", water: "50 m / 165 ft", bracelet: "Integrated steel bracelet" },
    dialStyle: navy,
  },
  {
    id: "ap-royal-oak-chronograph-41",
    brandId: "audemars-piguet",
    name: "Royal Oak Chronograph 41",
    reference: "26240ST",
    price: 47000,
    tagline: "Swiss Made · Chronograph",
    blurb:
      "The everyday Royal Oak chronograph, refined. A balanced three-counter layout in 41 mm with the integrated bracelet that defines the collection.",
    specs: { case: "41 mm · Stainless steel", movement: "Calibre 4401 · Automatic", water: "50 m / 165 ft", bracelet: "Integrated steel bracelet" },
    dialStyle: silver,
  },
  {
    id: "ap-code-1159-selfwinding",
    brandId: "audemars-piguet",
    name: "Code 11.59 Selfwinding",
    reference: "15210BC",
    price: 26800,
    tagline: "Swiss Made · Automatic",
    blurb:
      "The house's contemporary voice. A complex double-curved sapphire crystal floats over a lacquered dial set within an octagonal middle case and round bezel.",
    specs: { case: "41 mm · 18 ct white gold", movement: "Calibre 4302 · Automatic", water: "30 m / 100 ft", bracelet: "Alligator strap" },
    dialStyle: navy,
  },
  {
    id: "ap-royal-oak-openworked",
    brandId: "audemars-piguet",
    name: "Royal Oak Double Balance Openworked",
    reference: "15416ST",
    price: 96000,
    tagline: "Swiss Made · Openworked",
    blurb:
      "Horology laid bare. The double balance wheel is displayed through a fully skeletonised movement — mechanical theatre framed by the octagonal bezel.",
    specs: { case: "41 mm · Stainless steel", movement: "Calibre 3132 · Openworked", water: "50 m / 165 ft", bracelet: "Integrated steel bracelet" },
    dialStyle: slate,
  },

  /* ------------------------------- CARTIER ------------------------------- */
  {
    id: "cartier-santos-large",
    brandId: "cartier",
    name: "Santos de Cartier",
    reference: "WSSA0018",
    price: 7650,
    tagline: "Swiss Made · Automatic",
    blurb:
      "The first purpose-built pilot's watch, created in 1904 for aviator Alberto Santos-Dumont. Exposed screws and a squared bezel — modernism a century ahead of its time.",
    specs: { case: "39.8 mm · Stainless steel", movement: "Calibre 1847 MC · Automatic", water: "100 m / 330 ft", bracelet: "Steel · QuickSwitch" },
    dialStyle: cream,
  },
  {
    id: "cartier-tank-must-large",
    brandId: "cartier",
    name: "Tank Must",
    reference: "WSTA0041",
    price: 3430,
    tagline: "Swiss Made · Quartz",
    blurb:
      "Inspired by the Renault tanks of the Great War, the Tank distilled the wristwatch to two brancards and a rectangle. A century on, it is still the definition of restraint.",
    specs: { case: "33.7 mm · Stainless steel", movement: "High-autonomy quartz", water: "30 m / 100 ft", bracelet: "Leather strap" },
    dialStyle: silver,
  },
  {
    id: "cartier-ballon-bleu-40",
    brandId: "cartier",
    name: "Ballon Bleu 40 mm",
    reference: "WSBB0060",
    price: 7500,
    tagline: "Swiss Made · Automatic",
    blurb:
      "A watch that seems to float. The sapphire cabochon crown, cradled by a protective arc, gives the Ballon Bleu its unmistakable silhouette.",
    specs: { case: "40 mm · Stainless steel", movement: "Automatic", water: "30 m / 100 ft", bracelet: "Steel bracelet" },
    dialStyle: silver,
  },
  {
    id: "cartier-tank-francaise",
    brandId: "cartier",
    name: "Tank Française",
    reference: "WSTA0074",
    price: 4300,
    tagline: "Swiss Made · Automatic",
    blurb:
      "The Tank, dressed for the city. Its integrated bracelet and polished links carry the maison's most architectural case with effortless assurance.",
    specs: { case: "36.7 mm · Stainless steel", movement: "Automatic", water: "30 m / 100 ft", bracelet: "Steel bracelet" },
    dialStyle: silver,
  },
  {
    id: "cartier-panthere",
    brandId: "cartier",
    name: "Panthère de Cartier",
    reference: "WSPN0007",
    price: 4650,
    tagline: "Swiss Made · Quartz",
    blurb:
      "Supple as its namesake. Introduced in 1983 and revived to acclaim, the Panthère's articulated bracelet drapes the wrist like fine jewellery.",
    specs: { case: "27 mm · Stainless steel", movement: "High-autonomy quartz", water: "30 m / 100 ft", bracelet: "Steel bracelet" },
    dialStyle: cream,
  },
  {
    id: "cartier-santos-dumont",
    brandId: "cartier",
    name: "Santos-Dumont",
    reference: "WSSA0022",
    price: 5350,
    tagline: "Swiss Made · Quartz",
    blurb:
      "The slimmest expression of the Santos. A hand-finished case and slender profile honour the aviator who never wanted to look away from the sky to read the hour.",
    specs: { case: "38 mm · Stainless steel", movement: "High-autonomy quartz", water: "30 m / 100 ft", bracelet: "Leather strap" },
    dialStyle: silver,
  },

  /* ---------------------------- PATEK PHILIPPE --------------------------- */
  {
    id: "patek-nautilus-5711",
    brandId: "patek-philippe",
    name: "Nautilus",
    reference: "5711/1A-010",
    price: 34890,
    tagline: "Swiss Made · Automatic",
    blurb:
      "Genta's porthole. The horizontally embossed blue dial and rounded-octagon bezel made the Nautilus the most desired steel sports watch ever conceived.",
    specs: { case: "40 mm · Stainless steel", movement: "Calibre 26-330 S C · Automatic", water: "120 m / 400 ft", bracelet: "Integrated steel bracelet" },
    dialStyle: navy,
  },
  {
    id: "patek-aquanaut-5167",
    brandId: "patek-philippe",
    name: "Aquanaut",
    reference: "5167A-001",
    price: 23000,
    tagline: "Swiss Made · Automatic",
    blurb:
      "The younger sibling with a rebellious streak. An embossed 'tropical' dial and composite strap give the Aquanaut its contemporary, sporting ease.",
    specs: { case: "40 mm · Stainless steel", movement: "Calibre 324 S C · Automatic", water: "120 m / 400 ft", bracelet: "Composite strap" },
    dialStyle: charcoal,
  },
  {
    id: "patek-calatrava-6119",
    brandId: "patek-philippe",
    name: "Calatrava 6119G",
    reference: "6119G-001",
    price: 34000,
    tagline: "Swiss Made · Manual",
    blurb:
      "The purest dress watch. A revived Clous de Paris bezel frames an opaline dial — Patek's 1932 philosophy of understatement, uninterrupted.",
    specs: { case: "39 mm · 18 ct white gold", movement: "Calibre 30-255 PS · Manual", water: "30 m / 100 ft", bracelet: "Alligator strap" },
    dialStyle: silver,
  },
  {
    id: "patek-twenty-4-automatic",
    brandId: "patek-philippe",
    name: "Twenty~4 Automatic",
    reference: "7300/1200A",
    price: 13000,
    tagline: "Swiss Made · Automatic",
    blurb:
      "Conceived for the woman who wears her watch from boardroom to evening. A soft-cornered round case on a supple bracelet, self-winding at its heart.",
    specs: { case: "36 mm · Stainless steel", movement: "Calibre 324 S C · Automatic", water: "30 m / 100 ft", bracelet: "Steel bracelet" },
    dialStyle: navy,
  },
  {
    id: "patek-nautilus-5712",
    brandId: "patek-philippe",
    name: "Nautilus 5712",
    reference: "5712/1A-001",
    price: 40000,
    tagline: "Swiss Made · Automatic",
    blurb:
      "The Nautilus, complicated. A moon phase, power reserve and pointer date arranged with a jeweller's asymmetry across the embossed blue dial.",
    specs: { case: "40 mm · Stainless steel", movement: "Calibre 240 PS IRM C LU · Automatic", water: "60 m / 200 ft", bracelet: "Integrated steel bracelet" },
    dialStyle: navy,
  },
  {
    id: "patek-world-time-5230",
    brandId: "patek-philippe",
    name: "World Time 5230G",
    reference: "5230G-010",
    price: 54000,
    tagline: "Swiss Made · Automatic",
    blurb:
      "Twenty-four cities, one glance. Patek's Heure Universelle mechanism — invented with Louis Cottier — turns a hand-guilloché dial into a map of the world's time.",
    specs: { case: "38.5 mm · 18 ct white gold", movement: "Calibre 240 HU · Automatic", water: "30 m / 100 ft", bracelet: "Alligator strap" },
    dialStyle: navy,
  },

  /* --------------------------- JAEGER-LECOULTRE -------------------------- */
  {
    id: "jlc-reverso-tribute-duoface",
    brandId: "jaeger-lecoultre",
    name: "Reverso Tribute Duoface",
    reference: "Q3988482",
    price: 13400,
    tagline: "Swiss Made · Manual",
    blurb:
      "Born on the polo fields of 1931, the Reverso swivels to protect its crystal — and here reveals a second time zone on its reverse. Art Deco engineering at its finest.",
    specs: { case: "47 × 28.3 mm · Stainless steel", movement: "Calibre 854A/2 · Manual", water: "30 m / 100 ft", bracelet: "Alligator strap" },
    dialStyle: navy,
  },
  {
    id: "jlc-reverso-classic-medium",
    brandId: "jaeger-lecoultre",
    name: "Reverso Classic Medium",
    reference: "Q2548440",
    price: 8400,
    tagline: "Swiss Made · Manual",
    blurb:
      "The Reverso reduced to its essence. Clean baton indices, a slender case and the famous godrons — the quietest way to wear a legend.",
    specs: { case: "40.1 × 24.4 mm · Stainless steel", movement: "Calibre 822/2 · Manual", water: "30 m / 100 ft", bracelet: "Alligator strap" },
    dialStyle: silver,
  },
  {
    id: "jlc-master-ultra-thin-moon",
    brandId: "jaeger-lecoultre",
    name: "Master Ultra Thin Moon",
    reference: "Q1368420",
    price: 12300,
    tagline: "Swiss Made · Automatic",
    blurb:
      "A slim disc of blue night. The moon phase and date sit beneath a sunray dial, powered by a self-winding calibre finished in the Grande Maison tradition.",
    specs: { case: "39 mm · Stainless steel", movement: "Calibre 925 · Automatic", water: "50 m / 165 ft", bracelet: "Alligator strap" },
    dialStyle: navy,
  },
  {
    id: "jlc-polaris-date",
    brandId: "jaeger-lecoultre",
    name: "Polaris Date",
    reference: "Q9068681",
    price: 10200,
    tagline: "Swiss Made · Automatic",
    blurb:
      "The 1968 skin-diver, reborn. A gradient lacquer dial, inner rotating bezel and trapezoidal indices give the Polaris its confident, sporting character.",
    specs: { case: "42 mm · Stainless steel", movement: "Calibre 899 · Automatic", water: "200 m / 660 ft", bracelet: "Steel bracelet" },
    dialStyle: charcoal,
  },
  {
    id: "jlc-master-control-date",
    brandId: "jaeger-lecoultre",
    name: "Master Control Date",
    reference: "Q4018420",
    price: 8650,
    tagline: "Swiss Made · Automatic",
    blurb:
      "The dress watch, perfected over decades. An opaline dial, dauphine hands and a slim automatic calibre — restraint that rewards a lifetime of wear.",
    specs: { case: "40 mm · Stainless steel", movement: "Calibre 899 · Automatic", water: "50 m / 165 ft", bracelet: "Alligator strap" },
    dialStyle: silver,
  },
  {
    id: "jlc-rendez-vous-dazzling",
    brandId: "jaeger-lecoultre",
    name: "Rendez-Vous Dazzling",
    reference: "Q3572020",
    price: 11000,
    tagline: "Swiss Made · Automatic",
    blurb:
      "Where haute horlogerie meets haute joaillerie. A diamond-set bezel encircles a guilloché dial with the maison's signature floral numerals.",
    specs: { case: "36 mm · Stainless steel", movement: "Calibre 898A/1 · Automatic", water: "30 m / 100 ft", bracelet: "Alligator strap" },
    dialStyle: cream,
  },
];

export const watchById = (id: string) => watches.find((w) => w.id === id);
export const watchesByBrand = (brandId: string) => watches.filter((w) => w.brandId === brandId);

/** Watches featured on the home page. */
export const signaturePieceIds = [
  "rolex-submariner-date",
  "omega-speedmaster-moonwatch",
  "cartier-santos-large",
];
export const signaturePieces = signaturePieceIds
  .map((id) => watchById(id))
  .filter((w): w is Watch => Boolean(w));

/* -------------------------------------------------------------------------- *
 *  Photoreal face derivation
 *  Turns a watch's identity into rendering instructions for <WatchDial />.
 * -------------------------------------------------------------------------- */

export type WatchFace = {
  bezel: "smooth" | "fluted" | "dive" | "tachymeter" | "octagon";
  /** rotating-bezel insert colour (dive) */
  bezelInsert: string;
  markers: "applied" | "roman" | "baton";
  hands: "mercedes" | "dauphine" | "baton";
  finish: "sunburst" | "guilloche" | "opaline";
  date: boolean;
  chrono: boolean;
  gmt: boolean;
  moonphase: boolean;
  /** luminous colour on hands / markers */
  lume: string;
  /** overall case silhouette */
  caseShape: "round" | "cushion" | "rect" | "square" | "octagon";
  /** bracelet / strap style */
  band: "oyster" | "jubilee" | "president" | "integrated" | "steel" | "leather";
  /** leather strap colour */
  bandColor: string;
  /** case / bracelet / hardware metal */
  metal: "steel" | "white-gold" | "yellow-gold" | "rose-gold" | "two-tone";
};

export type MetalPalette = { light: string; mid: string; dark: string; hand: string; marker: string };

/** Realistic metal palettes — steel is cool silver, golds are warm. */
export const metalPalettes: Record<WatchFace["metal"], MetalPalette> = {
  steel: { light: "#f0f3f5", mid: "#aeb6bd", dark: "#5c636a", hand: "#eaeef1", marker: "#dde3e8" },
  "white-gold": { light: "#f4f6f8", mid: "#c2c8ce", dark: "#727a82", hand: "#eef1f4", marker: "#e2e7eb" },
  "yellow-gold": { light: "#f6e6b6", mid: "#c2a35f", dark: "#8a6a2c", hand: "#e6cd92", marker: "#e6cd92" },
  "rose-gold": { light: "#f2d6c5", mid: "#c98f74", dark: "#8a5540", hand: "#e6b49c", marker: "#e6b49c" },
  "two-tone": { light: "#f0f3f5", mid: "#aeb6bd", dark: "#5c636a", hand: "#e6cd92", marker: "#e6cd92" },
};

const has = (s: string, re: RegExp) => re.test(s);

/** Per-id refinements where derivation alone isn't ideal. */
const faceOverrides: Record<string, Partial<WatchFace>> = {
  "rolex-cosmograph-daytona": { hands: "baton" },
  "rolex-oyster-perpetual-41": { date: false },
  "omega-de-ville-tresor": { finish: "opaline", markers: "baton", hands: "dauphine" },
  "patek-calatrava-6119": { markers: "baton" },
  "cartier-ballon-bleu-40": { bezel: "smooth" },
  "cartier-tank-must-large": { bezel: "smooth" },
  "cartier-tank-francaise": { bezel: "smooth" },
  "jlc-master-control-date": { hands: "dauphine", markers: "baton" },
  "jlc-master-ultra-thin-moon": { hands: "dauphine", markers: "baton" },
  "ap-royal-oak-openworked": { finish: "guilloche" },
};

export function getWatchFace(w: Watch): WatchFace {
  const n = w.name;
  const chrono = has(w.tagline, /chronograph/i);
  const moonphase = has(n, /moon/i);
  const gmt = has(n, /gmt/i);

  const dateNames =
    /date|datejust|day-date|aquanaut|nautilus|seamaster|aqua terra|constellation|polaris|twenty|world time|santos|panth|master control/i;
  const date = !chrono && !moonphase && (has(n, dateNames) || gmt);

  let bezel: WatchFace["bezel"] = "smooth";
  if (has(n, /submariner|seamaster diver|polaris/i)) bezel = "dive";
  else if (has(n, /datejust|day-date/i)) bezel = "fluted";
  else if (chrono) bezel = "tachymeter";
  else if (w.brandId === "audemars-piguet" && has(n, /royal oak/i)) bezel = "octagon";
  else if (w.brandId === "patek-philippe" && has(n, /nautilus|aquanaut/i)) bezel = "octagon";

  let markers: WatchFace["markers"] = "applied";
  if (w.brandId === "cartier") markers = "roman";

  let hands: WatchFace["hands"] = "baton";
  if (w.brandId === "rolex" && !has(n, /daytona/i)) hands = "mercedes";
  else if (["patek-philippe", "jaeger-lecoultre"].includes(w.brandId) && !chrono) hands = "dauphine";

  let finish: WatchFace["finish"] = "sunburst";
  if (has(n, /nautilus|aquanaut/i)) finish = "guilloche";
  else if (w.dialStyle.light) finish = "opaline";

  const bezelInsert = bezel === "dive" ? w.dialStyle.dial : w.dialStyle.ring;
  const lume = w.dialStyle.light ? "#b8a36a" : "#dfeee2";

  // Case silhouette
  let caseShape: WatchFace["caseShape"] = "round";
  if (has(n, /tank|reverso/i)) caseShape = "rect";
  else if (has(n, /santos|panth/i)) caseShape = "square";
  else if (bezel === "octagon") caseShape = "octagon";
  else if (has(n, /ballon|constellation/i)) caseShape = "cushion";

  // Bracelet / strap
  let band: WatchFace["band"] = "steel";
  if (has(n, /nautilus|aquanaut|royal oak|santos de|tank fran|panth/i)) band = "integrated";
  else if (w.brandId === "rolex" && has(n, /day-date/i)) band = "president";
  else if (w.brandId === "rolex" && has(n, /datejust|gmt/i)) band = "jubilee";
  else if (w.brandId === "rolex") band = "oyster";
  else if (has(n, /omega|seamaster|aqua terra|speedmaster|constellation/i)) band = "steel";
  const leatherNames =
    /calatrava|reverso|tank must|de ville|master control|master ultra|code 11|world time|santos-dumont|rendez|twenty|polaris date|tribute/i;
  if (has(n, leatherNames) && band !== "integrated") band = "leather";
  if (has(w.specs.bracelet, /alligator|leather|strap|composite/i) && band !== "integrated") band = "leather";

  const bandColor = w.dialStyle.light ? "#6b4a2c" : "#2a1c12";

  // Metal, read from the case description
  let metal: WatchFace["metal"] = "steel";
  const cs = w.specs.case;
  if (/rose|everose/i.test(cs)) metal = "rose-gold";
  else if (/white gold/i.test(cs)) metal = "white-gold";
  else if (/yellow gold|18 ct|18k|pink gold/i.test(cs)) metal = "yellow-gold";

  return {
    metal,
    bezel,
    bezelInsert,
    markers,
    hands,
    finish,
    date,
    chrono,
    gmt,
    moonphase,
    lume,
    caseShape,
    band,
    bandColor,
    ...faceOverrides[w.id],
  };
}
