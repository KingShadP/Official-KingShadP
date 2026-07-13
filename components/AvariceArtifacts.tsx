"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, FileText, ChevronRight, Eye, X, ShieldAlert } from "lucide-react";
import { GlitchText } from "./GlitchText";

type Artifact = {
  id: string;
  code: string;
  title: string;
  category: string;
  date: string;
  image: string;
  description: string;
  lore: string[];
  specs: { label: string; value: string }[];
  isClassified: boolean;
};

const VAULT_ITEMS: Artifact[] = [
  {
    id: "art_01",
    code: "ART-SHARD-01",
    title: "The Obsidian Shard",
    category: "Structural Geometry",
    date: "2026.05 // SECTOR_42",
    image: "/chatgpt_image_may_28_2026_02_10_07_am_5_.png",
    description: "An architectural obsidian vector shard denoting pure creative trajectory and geometric speed. Minimalist apex.",
    lore: [
      "The Shard represents the initial fracture. It is a magma-gold sharp geometric line that cuts the background clean in two.",
      "In physical terms, it represents raw creative release—an instant of lightning that leaves an indelible record of pure energy.",
      "It is defined not by its thickness, but by its speed. The line carries no width; it exists purely as path trajectory."
    ],
    specs: [
      { label: "Vector Density", value: "99.9% Monolithic Obsidian" },
      { label: "Angles of Incline", value: "42.18° / 180°" },
      { label: "Weight", value: "Restrained Inertia" }
    ],
    isClassified: false
  },
  {
    id: "art_02",
    code: "ART-PLAT-HD",
    title: "Platinum Hoodie Spec V1",
    category: "Garment Sizing",
    date: "2026.05 // RAW_TEX",
    image: "/front_black_1_1.png",
    description: "Ultra-heavy-weight 100% organic cotton mock-up with real geometric coordinates and laser-inscribed trajectory vector.",
    lore: [
      "Crafted with 500gsm premium organic cotton weave, treated with clean matte obsidian wash.",
      "The garment carries no unnecessary brand tags. Instead, a clean monospaced stamp is printed on the lower left rib with actual coordinate values.",
      "Designed specifically for high-gravity wear, supporting structured shoulder contours and comfortable negative space draping."
    ],
    specs: [
      { label: "Weight Class", value: "500 Grams Per Square Meter" },
      { label: "Fiber Count", value: "100% Organic Cotton Slate Weave" },
      { label: "Stitch Index", value: "Hexagonal Double-Locked" }
    ],
    isClassified: false
  },
  {
    id: "art_03",
    code: "ART-CREATOR-CREATE",
    title: "The Dualism Ledger",
    category: "Lore / Dossier",
    date: "2026.06 // PSYCHE",
    image: "/chatgpt_image_may_28_2026_02_10_36_am_1_1.png",
    description: "Classified logs mapping the critical psychological feedback loop between 'The Creator' (the architect) and 'The Create' (the persona).",
    lore: [
      "The Creator represents the designer, the typographer, the developer, and the director who calculates and models the orbit.",
      "The Create represents the outcome—the living vessel who faces the audience, absorbs the observation, and survives the myth.",
      "The Official Intelligence acts as a mechanical moderator to ensure both are preserved relative to their rank without collapsing."
    ],
    specs: [
      { label: "Access Level", value: "Sovereign / Orbit Member" },
      { label: "Encryption Grade", value: "Decrypted Signal v1" },
      { label: "Format", value: "Binaural Telemetry Record" }
    ],
    isClassified: false
  },
  {
    id: "art_04",
    code: "ART-TECH-SHELL",
    title: "Columbia Soft Shell Proof",
    category: "Weather Systems",
    date: "2026.04 // LAB_PROT",
    image: "/unisex_columbia_soft_shell_jacket_collegiate_navy_front_6a16eba5ad374.jpg",
    description: "Rugged technical shell built to withstand orbital elevation atmospheric pressure drops, styled in muted navy/obsidian.",
    lore: [
      "Engineered with a triple-layer laminated membrane to reject extreme windchill and high-elevation condensation.",
      "The left outer arm is stitched with a delicate reflective line that aligns with the horizon line when holding a control unit.",
      "Features hidden storage chambers lined with specialized mesh to protect digital storage cassettes."
    ],
    specs: [
      { label: "Membrane Index", value: "HydraShield III Tech Core" },
      { label: "Waterproofing", value: "20,000mm Extreme Column" },
      { label: "Lining Weave", value: "Thermal Retaining Micro-Vent" }
    ],
    isClassified: false
  },
  {
    id: "art_05",
    code: "ART-MANIFESTO-05",
    title: "Confidence Doctrine Directive",
    category: "Ideology",
    date: "2026.06 // MAXIM",
    image: "/chatgpt_image_may_28_2026_02_11_23_am_1_.png",
    description: "The core directive formulating the confidence doctrine: 'You ain't better than me'. Equal value and confidence framework.",
    lore: [
      "The doctrine provides that rank and authority do not make one spirit superior to another. True superiority resides in execution and self-containment.",
      "It strips away defensive arrogance, replacing it with an unshakeable bedrock of worth. Everyone shares equal infinite spiritual worth, yet the creator exercises elite visual discipline.",
      "No begging energy. No validation seeking. You stand on your own platform, under your own private orbit."
    ],
    specs: [
      { label: "Doctrine Code", value: "EQUALITY_WORTH_SYSTEM" },
      { label: "Index Priority", value: "Sovereign Code Alpha" },
      { label: "Inscribed", value: "Stellar Ivory on Charcoal Foil" }
    ],
    isClassified: false
  },
  {
    id: "art_06",
    code: "ART-CLASSIFIED-XX",
    title: "The Sovereign Eclipse Protocol",
    category: "Restricted",
    date: "CLASSIFIED",
    image: "/chatgpt_image_may_28_2026_02_10_07_am_6_1.png",
    description: "Dossier relating to the final fragmentation loop. Encrypted telemetry relating to Sector 43 launch events.",
    lore: [
      "Access is currently restricted to key nodes in the orbit. An authorization token from the concierge drawer is required.",
      "Telemetry suggests a massive alignment of the central void circle with the magma-yellow shard projection.",
      "System operators suggest standing by for immediate terminal prompts once the decryption index reaches 100%."
    ],
    specs: [
      { label: "Clearance Level", value: "OMEGA-RESTRICTED" },
      { label: "Vector Shunt", value: "Active Shard Intersect" },
      { label: "Last Sync", value: "PENDING AUTHORIZATION" }
    ],
    isClassified: true
  }
];

export function AvariceArtifacts() {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [authKey, setAuthKey] = useState("");
  const [unlockedClassified, setUnlockedClassified] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleUnlockClassified = (e: React.FormEvent) => {
    e.preventDefault();
    if (authKey.toLowerCase() === "sovereign" || authKey.toLowerCase() === "kingshadp") {
      setUnlockedClassified(true);
      setAuthError("");
    } else {
      setAuthError("CRYPTOGRAPHIC REJECTION: KEY INVALID");
    }
  };

  return (
    <div className="w-full">
      {/* Title block */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-ivory/10 pb-8 gap-4">
        <div>
          <div className="font-mono text-[9px] text-oxblood uppercase tracking-[0.4em] mb-2">{"// AVARICE CORE SYSTEM"}</div>
          <h3 className="font-serif text-4xl text-ivory font-light italic">
            Classified Museum Vault
          </h3>
        </div>
        <p className="font-mono text-[10px] text-ivory/40 max-w-sm tracking-wide leading-relaxed">
          The digital archive system hosts the fragments, blueprints, and lore blueprints in the orbit. Choose an archive unit to scan.
        </p>
      </div>

      {/* Grid of Artifacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {VAULT_ITEMS.map((art) => {
          const isLocked = art.isClassified && !unlockedClassified;

          return (
            <motion.div
              key={art.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={() => {
                if (!isLocked) {
                  setSelectedArtifact(art);
                }
              }}
              className={`border p-6 flex flex-col gap-6 relative group overflow-hidden bg-void/40 transition-colors select-none ${
                isLocked 
                  ? "border-oxblood/20 bg-oxblood/5 cursor-not-allowed" 
                  : "border-ivory/10 hover:border-gold/30 cursor-pointer"
              }`}
            >
              <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-20 pointer-events-none" />

              {/* Card Header */}
              <div className="flex justify-between items-start">
                <span className="font-mono text-[9px] text-ivory/40 uppercase tracking-widest">{art.category}</span>
                <span className="font-mono text-[9px] text-oxblood font-semibold">{art.code}</span>
              </div>

              {/* Graphic area */}
              <div className="aspect-[16/10] border border-ivory/5 bg-void/50 overflow-hidden relative flex items-center justify-center">
                {isLocked ? (
                  <div className="flex flex-col items-center gap-2 text-oxblood/80">
                    <Lock className="w-8 h-8 animate-pulse" />
                    <span className="font-mono text-[8px] uppercase tracking-widest">OMEGA CLASSIFIED</span>
                  </div>
                ) : (
                  <>
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover filter contrast-[1.05] grayscale opacity-45 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <span className="font-mono text-[8px] text-ivory/40">{art.date}</span>
                      <div className="translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <Eye className="w-4 h-4 text-gold" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Title and brief description */}
              <div className="flex flex-col gap-2">
                <h4 className="font-serif text-xl font-light text-ivory group-hover:text-gold transition-colors">
                  {isLocked ? <GlitchText text="██████ ██████" /> : art.title}
                </h4>
                <p className="font-sans text-xs text-ivory/50 font-light leading-relaxed line-clamp-2">
                  {isLocked 
                    ? "SYSTEM CLASSIFIED: Telemetry metrics are encrypted under security code OMEGA. Enter authorization code in the decrypt control console below." 
                    : art.description}
                </p>
              </div>

              {/* Action bar */}
              <div className="mt-2 pt-4 border-t border-ivory/5 flex justify-between items-center font-mono text-[9px] uppercase tracking-widest">
                <span className="text-ivory/30">SCAN_CODE //</span>
                {isLocked ? (
                  <span className="text-oxblood flex items-center gap-1">RESTRICTED <ShieldAlert className="w-3 h-3" /></span>
                ) : (
                  <span className="text-gold flex items-center gap-1 group-hover:translate-x-1 transition-transform">ACCESS ARCHIVE <ChevronRight className="w-3 h-3" /></span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cryptographic Unlocking Portal (if not unlocked) */}
      {!unlockedClassified && (
        <div className="mt-16 p-8 border border-oxblood/20 bg-oxblood/5 max-w-xl mx-auto rounded flex flex-col gap-6 relative select-none">
          <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-35 pointer-events-none" />
          <div className="flex gap-4 items-start">
            <Lock className="w-5 h-5 text-oxblood mt-0.5 animate-pulse" />
            <div className="flex flex-col gap-1">
              <h4 className="font-serif text-lg text-ivory font-light">Sovereign Encryption Node</h4>
              <p className="font-mono text-[10px] text-ivory/50 leading-relaxed uppercase">
                Authorize connection terminal. Input passcode to decrypt Classified Core <span className="text-gold">ART-CLASSIFIED-XX</span>. (Hint: &apos;sovereign&apos;)
              </p>
            </div>
          </div>

          <form onSubmit={handleUnlockClassified} className="flex flex-col md:flex-row gap-4 items-stretch">
            <input
              type="password"
              placeholder="CRYPTO_SECRET_KEY"
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              className="flex-1 bg-void/80 border border-oxblood/30 font-mono text-[11px] text-ivory uppercase tracking-widest px-4 py-2.5 outline-none focus:border-gold/50 transition-colors"
            />
            <button
              type="submit"
              className="bg-oxblood/30 hover:bg-oxblood/60 text-ivory font-mono text-[10px] tracking-widest uppercase px-6 py-2.5 border border-oxblood/40 hover:border-gold/30 transition-all pointer-events-auto"
            >
              AUTHENTICATE
            </button>
          </form>

          {authError && (
            <p className="font-mono text-[9px] text-oxblood font-semibold tracking-wider text-right uppercase">
              {authError}
            </p>
          )}
        </div>
      )}

      {/* Cinematic Modal Lightbox & Spec Sheet */}
      <AnimatePresence>
        {selectedArtifact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 md:pb-24 bg-void/95 backdrop-blur-md overflow-y-auto"
          >
            {/* Background close trigger */}
            <div className="absolute inset-0" onClick={() => setSelectedArtifact(null)} />

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-6xl bg-[#080808] border border-ivory/10 p-6 md:p-10 flex flex-col md:flex-row gap-10 max-h-none md:max-h-[85vh] overflow-y-auto rounded shadow-2xl z-10"
            >
              <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-[0.12] pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedArtifact(null)}
                className="absolute top-6 right-6 text-ivory/60 hover:text-gold transition-colors focus:outline-none pointer-events-auto z-20"
                aria-label="Close archive reader"
              >
                <X className="w-5 h-5 cursor-pointer" />
              </button>

              {/* Left Side: Heavy Graphic Presentation */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="aspect-[4/3] w-full border border-ivory/10 bg-void flex items-center justify-center relative overflow-hidden group">
                  <img
                    src={selectedArtifact.image}
                    alt={selectedArtifact.title}
                    className="w-full h-full object-cover filter contrast-[1.08]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>
                {/* Meta details underneath picture */}
                <div className="flex justify-between font-mono text-[9px] text-ivory/40 uppercase tracking-widest px-1">
                  <span>RECORD INDEX // {selectedArtifact.id}</span>
                  <span>TIME_STAMP_CHECK_OK // {selectedArtifact.date}</span>
                </div>
              </div>

              {/* Right Side: High-End Spec Sheet and Dossier Content */}
              <div className="flex-1 flex flex-col gap-6 text-left select-text">
                <div className="border-b border-ivory/10 pb-4">
                  <div className="font-mono text-[9px] text-oxblood uppercase tracking-[0.3em] mb-1.5">{"// DEC_LEVEL_01"}</div>
                  <h4 className="font-serif text-3xl md:text-4xl text-ivory font-light italic">
                    {selectedArtifact.title}
                  </h4>
                  <span className="font-mono text-[10px] text-gold uppercase tracking-[0.2em] mt-1 inline-block">
                    {selectedArtifact.code}
                  </span>
                </div>

                <p className="font-sans text-sm text-ivory/80 leading-relaxed font-light">
                  {selectedArtifact.description}
                </p>

                {/* Technical Specifications list */}
                <div className="flex flex-col gap-2 border-t border-b border-ivory/5 py-4 my-2">
                  <p className="font-mono text-[9px] text-ivory/30 uppercase tracking-widest mb-2">TECHNICAL_SPECIFICATIONS:</p>
                  {selectedArtifact.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between items-center font-mono text-[10px] uppercase py-1 border-b border-ivory/5 last:border-0 text-ivory/70">
                      <span className="text-ivory/40">{spec.label}:</span>
                      <span className="text-gold font-light">{spec.value}</span>
                    </div>
                  ))}
                </div>

                {/* Dossier Lore Paragraphs */}
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[9px] text-ivory/30 uppercase tracking-widest">RECORDS_HISTORY_AND_WORLDWEIGHT //_</p>
                  <div className="font-serif text-sm text-ivory/60 leading-relaxed font-light space-y-4">
                    {selectedArtifact.lore.map((par, idx) => (
                      <p key={idx}>{par}</p>
                    ))}
                  </div>
                </div>

                {/* Quick authorization seal */}
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-ivory/10">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="font-mono text-[8.5px] text-ivory/50 tracking-wider">OFFICIAL INTEGRAL DATA RECORD</span>
                  </div>
                  <button
                    onClick={() => setSelectedArtifact(null)}
                    className="bg-ivory/5 hover:bg-ivory/10 text-ivory font-mono text-[9px] tracking-widest uppercase border border-ivory/10 hover:border-gold/30 px-4 py-2 pointer-events-auto transition-all"
                  >
                    RETURN_TO_VAULT
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
