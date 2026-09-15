// Demo content, bundled into the frontend.
//
// This started life in Postgres, managed through the Django admin, and the
// page fetched it server-side on every request. That backend is no longer
// deployed, so the same rows are frozen here as a typed module: the wizard
// has no network dependency at all and the site is a single static-ish
// Next.js service.
//
// Snapshot of `GET /api/brew-methods/` and `GET /api/origins/` as seeded by
// `backend/coffee/management/commands/seed_coffee.py`. The `image` paths are
// unchanged from what Django served under `/media/`; the same files now live
// in `frontend/public/media/`, so the paths resolve against the frontend's
// own origin without a rewrite. Editing content means editing this file and
// redeploying — the trade the demo makes for not needing a database.

export type RatingLevel = "low" | "medium" | "good" | "high";

export type RatingKey =
  | "acidity"
  | "body"
  | "sweetness"
  | "aroma"
  | "bitterness";

export type BrewMethod = {
  id: number;
  name: string;
  slug: string;
  image: string;
  order: number;
  description: string;
};

export type Origin = {
  id: number;
  name: string;
  slug: string;
  image: string;
  order: number;
  acidity: RatingLevel;
  acidity_display: string;
  body: RatingLevel;
  body_display: string;
  sweetness: RatingLevel;
  sweetness_display: string;
  aroma: RatingLevel;
  aroma_display: string;
  bitterness: RatingLevel;
  bitterness_display: string;
  /** Country flag shown on the origin card, e.g. "/media/flags/colombia.png". */
  flag?: string;
  /** Short tasting-note blurb, may contain a newline. */
  tasting?: string;
  /** Brew-method icons this origin is well-suited to. */
  suitableForIcons?: string[];
};

export const BREW_METHODS: BrewMethod[] = [
  {
    id: 1,
    name: "V60",
    slug: "v60",
    image: "/media/brew_methods/v60.png",
    order: 0,
    description: "A classic pour-over brewing method.",
  },
  {
    id: 2,
    name: "اسپرسو خانگی",
    slug: "home-espresso",
    image: "/media/brew_methods/espresso-home.png",
    order: 1,
    description: "A home espresso brewing method for rich coffee.",
  },
  {
    id: 3,
    name: "ایروپرس",
    slug: "aeropress",
    image: "/media/brew_methods/aeropress.png",
    order: 2,
    description: "A versatile brewing method using air pressure.",
  },
  {
    id: 4,
    name: "سایفون",
    slug: "siphon",
    image: "/media/brew_methods/siphon.png",
    order: 3,
    description: "A visually engaging brewing method using vacuum pressure.",
  },
  {
    id: 5,
    name: "فرانسه ساز",
    slug: "france-press",
    image: "/media/brew_methods/france-press.png",
    order: 4,
    description: "A French press brewing method for full-bodied coffee.",
  },
  {
    id: 6,
    name: "فرنچ پرس",
    slug: "french-press",
    image: "/media/brew_methods/french-press.png",
    order: 5,
    description: "A French press brewing method for full-bodied coffee.",
  },
  {
    id: 7,
    name: "کلد برو",
    slug: "cold-brew",
    image: "/media/brew_methods/cold-brew.png",
    order: 6,
    description: "A French press brewing method for full-bodied coffee.",
  },
  {
    id: 8,
    name: "کمکس",
    slug: "chemex",
    image: "/media/brew_methods/chemex.png",
    order: 7,
    description: "A French press brewing method for full-bodied coffee.",
  },
  {
    id: 9,
    name: "موکاپات قهوه",
    slug: "moka-pot",
    image: "/media/brew_methods/moka-pot.png",
    order: 8,
    description: "A French press brewing method for full-bodied coffee.",
  },
  {
    id: 10,
    name: "نانو پرسو",
    slug: "nano-espresso",
    image: "/media/brew_methods/nano-espresso.png",
    order: 9,
    description: "A French press brewing method for full-bodied coffee.",
  },
  {
    id: 11,
    name: "نیمه صنعتی",
    slug: "semi-industrial",
    image: "/media/brew_methods/semi-industrial.png",
    order: 10,
    description: "A French press brewing method for full-bodied coffee.",
  },
];

export const ORIGINS: Origin[] = [
  {
    id: 1,
    name: "برزیل",
    slug: "kenya",
    image: "/media/origins/kenya.jpg",
    flag: "/media/flags/kenya.png",
    tasting: "میوه‌ای، اسیدی\nو پرحسم",
    suitableForIcons: [
      "/media/icons/espresso.svg",
      "/media/icons/filter.svg",
      "/media/icons/pour-over.svg",
      "/media/icons/cold-brew.svg",
    ],
    order: 0,
    acidity: "high",
    acidity_display: "زیاد",
    body: "low",
    body_display: "کم",
    sweetness: "good",
    sweetness_display: "خوب",
    aroma: "high",
    aroma_display: "زیاد",
    bitterness: "low",
    bitterness_display: "کم",
  },
  {
    id: 2,
    name: "کلمبیا",
    slug: "colombia",
    image: "/media/origins/colombia.jpg",
    flag: "/media/flags/colombia.png",
    tasting: "معتدل، شکلاتی\nو شیرین",
    suitableForIcons: [
      "/media/icons/espresso.svg",
      "/media/icons/milk.svg",
      "/media/icons/filter.svg",
      "/media/icons/cold-brew.svg",
    ],
    order: 1,
    acidity: "medium",
    acidity_display: "متوسط",
    body: "good",
    body_display: "خوب",
    sweetness: "good",
    sweetness_display: "خوب",
    aroma: "medium",
    aroma_display: "متوسط",
    bitterness: "medium",
    bitterness_display: "متوسط",
  },
  {
    id: 3,
    name: "پرو",
    slug: "peru",
    image: "/media/origins/peru.jpg",
    flag: "/media/flags/peru.png",
    tasting: "ملایم، آجیلی\nو متعادل",
    suitableForIcons: [
      "/media/icons/milk.svg",
      "/media/icons/filter.svg",
      "/media/icons/pour-over.svg",
    ],
    order: 2,
    acidity: "low",
    acidity_display: "کم",
    body: "high",
    body_display: "زیاد",
    sweetness: "medium",
    sweetness_display: "متوسط",
    aroma: "medium",
    aroma_display: "متوسط",
    bitterness: "medium",
    bitterness_display: "متوسط",
  },
  {
    id: 4,
    name: "اتیوپی",
    slug: "ethiopia",
    image: "/media/origins/ethiopia.jpg",
    flag: "/media/flags/ethiopia.png",
    tasting: "گلی، مرکباتی\nو روشن",
    suitableForIcons: [
      "/media/icons/filter.svg",
      "/media/icons/pour-over.svg",
      "/media/icons/cold-brew.svg",
    ],
    order: 3,
    acidity: "high",
    acidity_display: "زیاد",
    body: "low",
    body_display: "کم",
    sweetness: "good",
    sweetness_display: "خوب",
    aroma: "high",
    aroma_display: "زیاد",
    bitterness: "low",
    bitterness_display: "کم",
  },
];
