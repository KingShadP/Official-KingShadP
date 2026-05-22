import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Define the cosmic constellations and their "prime keys"
interface ConstellationData {
  name: string;
  idealLat: number;
  idealAsc: number;
  description: string;
  baseCycles: number;
  favorableEncounter: string;
  hazardousEncounter: string;
  resourceGain: string;
  resourceLoss: string;
}

const CONSTELLATIONS: Record<string, ConstellationData> = {
  "The Scepter of Avarice": {
    name: "The Scepter of Avarice",
    idealLat: 45,
    idealAsc: 12.0,
    description: "The primary node of the sovereign. Radiates with blinding gold fires.",
    baseCycles: 15,
    favorableEncounter: "Platinum Dawn Sanctuary",
    hazardousEncounter: "Avarice Reaver Ambush",
    resourceGain: "Gold Fire (+25)",
    resourceLoss: "Void Dust (-10)",
  },
  "Oxblood Eclipse": {
    name: "Oxblood Eclipse",
    idealLat: -90,
    idealAsc: 3.3,
    description: "A dark star alignment shrouded in menacing crimson hues and velvet shadows.",
    baseCycles: 30,
    favorableEncounter: "Abyssal Bleeding Core",
    hazardousEncounter: "Oxblood Resonance Wave",
    resourceGain: "Thorn Shards (+40)",
    resourceLoss: "Platinum Essence (-15)",
  },
  "Platinum Spire": {
    name: "Platinum Spire",
    idealLat: 0,
    idealAsc: 0.0,
    description: "The pristine vector of pure white light, aligned with the first gallery of creation.",
    baseCycles: 20,
    favorableEncounter: "Sovereign Lattice Align",
    hazardousEncounter: "Crystalline Fracture",
    resourceGain: "Platinum Essence (+30)",
    resourceLoss: "Gold Fire (-8)",
  },
  "The Silent Lion": {
    name: "The Silent Lion",
    idealLat: 110,
    idealAsc: 18.5,
    description: "An ancient protective node that guards the secrets of the velvet vault.",
    baseCycles: 45,
    favorableEncounter: "Royal Shield Resonance",
    hazardousEncounter: "Obsidian Lion Roar",
    resourceGain: "Void Dust (+50)",
    resourceLoss: "Thorn Shards (-20)",
  },
  "Obsidian Helix": {
    name: "Obsidian Helix",
    idealLat: -33,
    idealAsc: 8.8,
    description: "A dangerous spiral in the deep black marble structure of the multiverse.",
    baseCycles: 25,
    favorableEncounter: "Dark Mirror Siphoning",
    hazardousEncounter: "Helix Singularity Collapse",
    resourceGain: "Thorn Shards (+20), Gold Fire (+15)",
    resourceLoss: "Platinum Essence (-25)",
  },
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ text: "The astrolabe remains locked. [MISSING_API_KEY]" }, { status: 500 });
    }

    const { constellation, latitude, ascension } = await req.json();

    if (!constellation || latitude === undefined || ascension === undefined) {
      return NextResponse.json({ error: "Invalid coordinates provided." }, { status: 400 });
    }

    const data = CONSTELLATIONS[constellation];
    if (!data) {
      return NextResponse.json({ error: "Constellation not registered in the archives." }, { status: 404 });
    }

    const latDelta = Math.abs(latitude - data.idealLat);
    const ascDelta = Math.abs(ascension - data.idealAsc);
    
    // Total distortion score
    const distortion = latDelta + ascDelta * 10; // Ascension has a scaling factor
    
    // Calculated values
    const travelCycles = parseFloat((data.baseCycles + distortion * 0.2).toFixed(1));
    const encounterChance = Math.min(100, Math.round(15 + distortion * 1.5));
    
    let encounterType = "Standard Distortion Cascade";
    let statusText = "Unstable Velocity Grid";
    let isPerfect = false;
    let resourceDetails = "";

    if (distortion < 8) {
      // Near perfect alignment
      encounterType = data.favorableEncounter;
      statusText = "Sacred Celestial Alignment Detected";
      isPerfect = true;
      resourceDetails = `${data.resourceGain} (Enhanced +50%)`;
    } else if (distortion > 60) {
      // Extremely high alignment deviation
      encounterType = data.hazardousEncounter;
      statusText = "Extreme Void Turbulence Risk";
      resourceDetails = `${data.resourceLoss} (Double Decay)`;
    } else {
      // Mid-range deviation
      encounterType = Math.random() > 0.5 ? "Subtle Stellar Friction" : "Acolyte Watcher Probe";
      statusText = "Stable Trajectory Plot";
      resourceDetails = `${data.resourceGain}, but costs ${data.resourceLoss}`;
    }

    // Initialize Gemini
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `You are the Divine Celestial Astrolabe of 'The Verse', a colossal god-tier multiverse computational archivist of the private lore registry.
The traveler has plotted a course aligning with the constellation: "${constellation}" at celestial latitude: ${latitude}° and right ascension: ${ascension}h.
The computed metrics for this trajectory are:
- Alignment offset (Distortion score): ${distortion.toFixed(2)}
- Trajectory Status: "${statusText}"
- Predicted Encounter Event: "${encounterType}"
- Projected Impact of Resources: "${resourceDetails}"
- Travel duration: ${travelCycles} cycles

Provide a profound, menacing, highly polished, and poetic navigational decree (2 sentences max) in the voice of the Divine Astrolabe, predicting the exact cosmic fate, metaphysical consequences, or deep mysteries that await the player on this specific thread of the multiverse. Draw heavily on gold fire, blood-red stars, velvet crowns, and obsidian realities. Do not use greetings or preambles. Deliver the poetic decree immediately. Maintain the cold luxury, exclusive tone of KingShadP's archives.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.85,
        topP: 0.9,
      },
    });

    const prophecy = response.text || "The astrolabe turns in quiet judgment, but the signals are scrambled.";

    return NextResponse.json({
      constellation,
      latitude,
      ascension,
      idealLat: data.idealLat,
      idealAsc: data.idealAsc,
      distortion,
      travelCycles,
      encounterChance,
      encounterType,
      statusText,
      isPerfect,
      resourceDetails,
      prophecy: prophecy.trim(),
    });
  } catch (error) {
    console.error("Navigation API Error:", error);
    return NextResponse.json({ error: "The astrolabe rings jam. A mechanical rift has occurred." }, { status: 500 });
  }
}
