export const NAV_LINKS = [
  { href: "/archive", label: "Archive", index: "01" },
  { href: "/music", label: "Music", index: "02" },
  { href: "/world", label: "World", index: "03" },
];

export type Artifact = {
  ref: string;
  name: string;
  spec: string;
  img: string;
  span?: string; // tailwind col-span class for the archive grid
  contain?: boolean;
};

export const ARTIFACTS: Artifact[] = [
  {
    ref: "SS-01",
    name: "Soft Shell Jacket — Onyx",
    spec: "Outerwear / Giragon Insignia",
    img: "/unisex-columbia-soft-shell-jacket-black-front-6a16eba5ad2c4.jpg",
    span: "md:col-span-7",
  },
  {
    ref: "SS-02",
    name: "Soft Shell Jacket — Graphite",
    spec: "Outerwear / Giragon Insignia",
    img: "/unisex-columbia-soft-shell-jacket-graphite-front-6a16eba5ad405.jpg",
    span: "md:col-span-5",
  },
  {
    ref: "SS-03",
    name: "Soft Shell Jacket — Navy",
    spec: "Outerwear / Giragon Insignia",
    img: "/unisex-columbia-soft-shell-jacket-collegiate-navy-front-6a16eba5ad374.jpg",
    span: "md:col-span-5",
  },
  {
    ref: "CT-01",
    name: "Crafter Tee — Desert Dust",
    spec: "Organic Cotton / Front Print",
    img: "/unisex-organic-mid-light-crafter-t-shirt-desert-dust-front-6a16dd454c251.jpg",
    span: "md:col-span-7",
  },
  {
    ref: "CT-02",
    name: "Crafter Tee — French Navy",
    spec: "Organic Cotton / Front Print",
    img: "/unisex-organic-mid-light-crafter-t-shirt-french-navy-front-6a16dd454c318.jpg",
    span: "md:col-span-4",
  },
  {
    ref: "CT-03",
    name: "Crafter Tee — Onyx, Signature Back",
    spec: "Organic Cotton / Back Print",
    img: "/unisex-organic-mid-light-crafter-t-shirt-black-back-6a16dd454caca.jpg",
    span: "md:col-span-4",
  },
  {
    ref: "IN-01",
    name: "The Crest",
    spec: "House Insignia / Source Mark",
    img: "/media/crest.webp",
    span: "md:col-span-4",
    contain: true,
  },
];

export const TRACKS = [
  { id: "01", title: "The Silent Protocol", note: "Fragment / Vol. 1", root: 55.0, src: "" },
  { id: "02", title: "Vision Architect", note: "Fragment / Vol. 1", root: 65.41, src: "" },
  { id: "03", title: "Echo Directive", note: "Fragment / Vol. 1", root: 73.42, src: "" },
  { id: "04", title: "Final Command", note: "Fragment / Vol. 1", root: 82.41, src: "" },
];

export const WORLD_SECTIONS = [
  {
    kicker: "The Official Intelligence",
    title: "Architecture, not decoration.",
    body: [
      "The Verse begins as a name, but the name is only the surface. Beneath it is a system of identity, taste, self-invention, discipline, and transformation.",
      "Luxury without meaning becomes costume. Power without restraint becomes noise. The Official Intelligence exists to prevent that collapse — it gives the mark a brain, the sound a body, and the visuals a hierarchy. This is KingShadP as architecture.",
    ],
  },
  {
    kicker: "The Creator // The Create",
    title: "The engine is a split.",
    body: [
      "The Creator is the architect — the part of the self that chooses the name, designs the symbols, shapes the sound, and decides how the world should feel.",
      "The Create is the result — the human who lives inside the persona and carries the weight of being seen. The Creator made the myth. The Create survived it. KingShadP is what happens when both refuse to disappear.",
    ],
  },
  {
    kicker: "The Ruler Code",
    title: "Rank before noise.",
    body: [
      "Everything in this world holds rank. The crest carries recognition. The wordmark carries the official name. Nothing begs for attention — the code says: do the work, define the standard, and let recognition grow from consistency.",
      "Own the room. Do not overcrowd it. Let every silence have weight.",
    ],
  },
  {
    kicker: "The Luxury of Silence",
    title: "Taste is knowing what not to add.",
    body: [
      "A room with every symbol displayed at once feels insecure. A room with one correct symbol in the right place feels controlled. Restraint is what turns luxury from decoration into atmosphere.",
      "When something is withheld, the audience leans in. They interpret. They search. They remember.",
    ],
  },
];
