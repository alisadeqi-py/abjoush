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

export type BrewMethod = {
  id: number;
  name: string;
  slug: string;
  image: string;
  order: number;
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
};

export const BREW_METHODS: BrewMethod[] = [
  {
    id: 1,
    name: "V60",
    slug: "v60",
    image: "/media/brew_methods/v60.png",
    order: 0,
  },
  {
    id: 2,
    name: "اسپرسو خانگی",
    slug: "home-espresso",
    image: "/media/brew_methods/espresso-home.png",
    order: 1,
  },
  {
    id: 3,
    name: "ایروپرس",
    slug: "aeropress",
    image: "/media/brew_methods/aeropress.png",
    order: 2,
  },
  {
    id: 4,
    name: "سایفون",
    slug: "siphon",
    image: "/media/brew_methods/siphon.png",
    order: 3,
  },
  {
    id: 5,
    name: "فرانسه ساز",
    slug: "france-press",
    image: "/media/brew_methods/france-press.png",
    order: 4,
  },
  {
    id: 6,
    name: "فرنچ پرس",
    slug: "french-press",
    image: "/media/brew_methods/french-press.png",
    order: 5,
  },
  {
    id: 7,
    name: "کلد برو",
    slug: "cold-brew",
    image: "/media/brew_methods/cold-brew.png",
    order: 6,
  },
  {
    id: 8,
    name: "کمکس",
    slug: "chemex",
    image: "/media/brew_methods/chemex.png",
    order: 7,
  },
  {
    id: 9,
    name: "موکاپات قهوه",
    slug: "moka-pot",
    image: "/media/brew_methods/moka-pot.png",
    order: 8,
  },
  {
    id: 10,
    name: "نانو پرسو",
    slug: "nano-espresso",
    image: "/media/brew_methods/nano-espresso.png",
    order: 9,
  },
  {
    id: 11,
    name: "نیمه صنعتی",
    slug: "semi-industrial",
    image: "/media/brew_methods/semi-industrial.png",
    order: 10,
  },
];

export const ORIGINS: Origin[] = [
  {
    id: 1,
    name: "کنیا",
    slug: "kenya",
    image: "/media/origins/kenya.jpg",
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
];
