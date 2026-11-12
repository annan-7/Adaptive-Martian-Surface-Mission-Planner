# Deterministic scenario

All mission data are SIMULATED_SCENARIO. Calculations are DERIVED_FROM_SIMULATION. The synchronized fictional clock is neither Mars local solar time nor an operational clock. One-way communication delay is fixed at 20 minutes for this experiment.

The initial 14:00 agreement is a preexisting shared fixture; it is not a newly sent message exempted from transit. At 14:20 Mars observes loose terrain on the schematic S1–S2 segment and sends O-01 (20 to 35 minutes travel). Earth receives O-01 at 14:40. Earth creates/sends R-02 at 14:45 using evidence available by 14:40. Mars receives R-02 at 15:05. No acknowledgment event exists. Local outgoing records show scheduled arrival but do not assert confirmed remote receipt.

Historical views are recomputed from the selected time. Sender sees its own record at creation; recipient only at arrival. Earth at 14:25 has only the shared original plan. It receives no warning about the unseen change. R-01 requires review only after local receipt of contradiction. R-02 refers to the 14:25 checkpoint, not to an unverified current crew position or remaining-work state.

## Locked complex reasoning variant

Deadline 16:30; checkpoint 14:25; available 125 minutes; reserve 30 minutes. The reserve is an invented rule. Formula: available − (travel + science + return + reserve).

- Continue S2 after O-01: 35 + 25 + 55 + 30 = 145; margin −20.
- Finish S1: 0 + 20 + 55 + 30 = 105; margin +20.
- Return now: 0 + 0 + 50 + 30 = 80; margin +45.
- Original S2: 20 + 25 + 55 + 30 = 130; margin −5.

The original plan already violates the constraint at the checkpoint. This is explicitly a complex reasoning confound, not evidence that the terrain change alone caused infeasibility.

## Matched primary variant

Only S2 science duration changes from 25 to 15 minutes. All other inputs and all message times stay identical. Original S2: 20 + 15 + 55 + 30 = 120; margin +5. Revised S2: 35 + 15 + 55 + 30 = 135; margin −10. S1 and return totals remain 105 and 80. Thus the observation alone crosses the fictional time constraint. Each condition uses exactly the same selected variant.

The UI labels all option arithmetic as a fixed 14:25 checkpoint analysis, even when viewing earlier or later knowledge. It does not subtract elapsed time and pretend that unobserved crew progress is known. A positive margin never certifies safety. Travel geometry, reachability, life support, physiology, radiation and operational authority are not modeled.
