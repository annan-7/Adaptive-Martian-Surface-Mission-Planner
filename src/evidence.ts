import registry from "../data/sources.json";
export type EvidenceType =
  | "VERIFIED_SOURCE"
  | "SCIENTIFIC_INTERPRETATION"
  | "SIMULATED_SCENARIO"
  | "DERIVED_FROM_SIMULATION"
  | "UNVERIFIED";
export const sources = registry;
export const scienceCards = [
  {
    id: "S1",
    title: "Ancient delta deposition",
    region: "Kodiak & the western delta",
    question:
      "What do inclined and horizontal layers reveal about deposition into an ancient lake?",
    observation:
      "NASA reports inclined and horizontal strata on Kodiak’s eastern face, imaged by Mastcam-Z and RMI.",
    interpretation:
      "The reported layer geometry supports river-delta deposition into an ancient lake.",
    uncertainty:
      "This prototype does not independently analyze the images. Regional map pixels cannot resolve these layers. Kodiak is not located as an EVA waypoint.",
    activity:
      "Hypothetical: document layer geometry and compare sedimentary relationships.",
    deferred:
      "Deferring S1 loses the scenario’s additional record of depositional architecture.",
    sourceIds: ["NASA-JEZERO-2021", "NASA-DELTA-IMAGE"],
    evidenceType: "SCIENTIFIC_INTERPRETATION" as EvidenceType,
  },
  {
    id: "S2",
    title: "Later energetic flooding",
    region: "Boulder-bearing delta scarps",
    question:
      "What do coarse deposits suggest about later changes in flow energy?",
    observation:
      "NASA reports stones and boulders in upper scarp deposits, above lower layered deposits.",
    interpretation:
      "The science team interprets later fast-moving floods capable of transporting coarse material.",
    uncertainty:
      "No validated astronaut sampling site, mineral detection, biosignature, or reachable traverse is claimed.",
    activity:
      "Hypothetical: describe clast sizes and their stratigraphic context.",
    deferred:
      "Deferring S2 loses the scenario’s additional comparison of later energetic flow deposits.",
    sourceIds: ["NASA-JEZERO-2021"],
    evidenceType: "SCIENTIFIC_INTERPRETATION" as EvidenceType,
  },
];
