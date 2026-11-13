type Assumption = { id: string; travelAssumption: number };

// Call only with a recommendation and evidence from the role's local projection.
export function assessRecommendation(advice: Assumption, observation?: Assumption) {
  if (observation && advice.travelAssumption !== observation.travelAssumption) {
    return {
      status: "requires_review" as const,
      reason: `Locally known ${observation.id} contradicts the ${advice.travelAssumption}-minute S2 travel assumption.`,
    };
  }
  return {
    status: advice.id === "R-02" ? "reassessed" as const : "not_reassessed" as const,
    reason: "No locally known contradiction to travel assumption. Time feasibility is a separate check.",
  };
}
