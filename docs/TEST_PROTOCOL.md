# Facilitated pilot protocol — no human pilot completed

## Purpose and controls

Test the unproven explanation-comprehension hypothesis, not route safety. Recruit actual consenting participants; use anonymous IDs. Record role, condition, variant, order and prior Mars/domain familiarity. Do not write agent-generated answers into a human dataset. Automated flows are **SYNTHETIC DRY-RUN — NOT HUMAN TESTING**.

Use the primary variant first: its original S2 budget fits and the observation alone causes violation. Use the canonical variant as a separately reported complex-reasoning block. Do not combine their outcomes as interchangeable trials. All A/B/C modes share exact scientific source cards, time inputs, tasks and raw messages. A offers the map and raw records; B adds chronology; C adds linked assumption and review explanations. A's messages, advice assumptions, segment inspector and option arithmetic remain discoverable.

Counterbalance A/B/C order across participants with ABC, BCA, CAB, ACB, CBA, BAC. Balance role order independently. Reusing the same scenario causes learning: record exposure order, use separate role/scenario blocks, and analyze first exposure separately. Small convenience samples cannot establish generalizable superiority.

## Setup

1. Build the participant app and serve only `dist` on port 4173. Serve `facilitator` separately on 4174. Do not expose the repository or Vite development server during a study.
2. Open the facilitator console privately. Assign condition, role and variant; open the participant link on the participant screen. Answer key is `facilitator/key.json`, fetched only by that separately served console. It is not imported by the participant app.
3. Explain simulation labels, regional map versus schematic route, fixed 14:25 arithmetic, and lack of operational authority. Give a neutral tour of all tabs in every condition.
4. Begin at 14:00. In the facilitator console choose the next phase using the time selector, then click **Apply time to open session**. Confirm the participant clock changes. Only released phases are enabled; participants may rewind within them. Keep the opener console open. Role and condition are fixed for each URL. The local prototype is not adversarially tamper-proof; supervise URL changes and developer tools.

## Participant packets

Both roles: inspect S1 and S2 source cards. Explain what observations support each question, what is interpretation, and what remains uncertain. You may use all tabs. Do not treat a positive margin as evidence of safety. State what you know and how you know it.

Astronaut: advance to 14:20 then 14:25. Inspect your local information. Compare options at the fixed checkpoint. Explain whether earlier advice still rests on known assumptions. Do not assume Earth already knows your observation.

Earth Planner: advance to 14:25. Explain what you know, what is unknown, and what the available timestamp means. Do not infer specific remote conditions from data age. Then advance to 14:40 and 14:45; explain what changed in your evidence and what crew decisions remain unknown.

Both roles: reconstruct knowledge at 14:45 and 15:05. Distinguish sent, received and acknowledged. Rewind to test historical knowledge. R-02 describes checkpoint alternatives, not a verified current instruction.

## Six tasks and scoring

Use the six numbered tasks in the participant Notebook: science values; known travel estimate; Earth at 14:25; R-01 assumption versus feasibility; alternatives; 14:45/15:05 knowledge and acknowledgment. Start the task timer immediately before each task. Participant enters explanation, confusion, workload (1–7) and confidence (1–7), then saves. Unstarted timers remain null. No correctness is auto-inferred.

Facilitator scores each task 0 (incorrect/no answer), 1 (partly correct, important uncertainty missing), 2 (correct with evidence and uncertainty). Record actual completion time, confusions and any prompt assistance. Use the private console's answer key. Correctness and confidence must remain separate to assess overconfidence. Export participant entries before refresh; export facilitator observations separately and join by matching `sessionId` and anonymous `participant` code in your analysis. Assign the code in the console before launching. Export before opening another session; do not mix notes across people.

Exploratory targets from the brief: at least 90% stale-assumption recognition, 85% change comprehension, and 25% faster justified decisions than baseline. These are proposed targets, not observed results. Report raw counts and descriptive timing distributions, sample size, order effects and missing responses. Do not claim statistical significance or operational validation from a small pilot.

## Known protection limits

The participant production bundle has no answer key or facilitator notes. Participant exports contain only projected knowledge and locally entered interaction records. Client-side scenario fixtures can be inspected by a technically motivated participant; this is a supervised pilot tool, not a secure examination platform. Keep facilitator files on a separate private screen/server. No real participant results exist in this repository.

## Validation gate for this revision

Before recruiting, run the updated 11 Playwright checks and five Python geodata tests locally. The current agent environment cannot open server sockets and cannot install the Python packages, so this revision has not passed those checks. Production-build asset checks and static React rendering checks are not a substitute for visual/browser QA. Verify layer toggling, both science cards, map fallback, phase release, keyboard navigation and real note export on the intended device. Keep screenshots and synthetic test exports separate from human data.
