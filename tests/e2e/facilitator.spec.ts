import { test, expect } from "@playwright/test";
test("separate facilitator controls and real notes export", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:4174");
  await expect(page.getByLabel(/Actual facilitator notes/)).toHaveValue("");
  await expect(
    page.getByText("Only original shared plan.", { exact: false }),
  ).toHaveCount(0);
  await page.getByText("Facilitator-only answer key", { exact: true }).click();
  await expect(page.locator("#key")).toContainText(
    "Only original shared plan.",
  );
  await page.getByLabel("Participant origin").fill("http://127.0.0.1:4173");
  await page.getByLabel("Anonymous participant code").fill("synthetic-dry-run");
  await page.getByRole("combobox", { name: "Role", exact: true }).selectOption("earth");
  await page.getByRole("combobox", { name: "Condition", exact: true }).selectOption("A");
  await page.getByRole("combobox", { name: "Initial scenario time", exact: true }).selectOption("865");
  const opened = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Open participant session" }).click();
  const participant = await opened;
  await expect(
    participant.getByRole("button", { name: "14:25", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(participant.locator("body")).toContainText("Earth Planner");
  await expect(participant.locator("body")).not.toContainText("answer key");
  await expect(participant.getByText("Explore roles and study modes")).toHaveCount(0);
  await expect(participant.getByRole("button", { name: "15:05", exact: true })).toBeDisabled();
  // A participant's own message is not a command from the trusted opener.
  await participant.evaluate(() => window.postMessage({ type: "mars-compass:set-time", sessionId: new URLSearchParams(location.search).get("session"), time: 905 }, location.origin));
  await expect(participant.getByRole("button", { name: "14:25", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("combobox", { name: "Initial scenario time", exact: true }).selectOption("880");
  await page.getByRole("button", { name: "Apply time to open session" }).click();
  await expect(participant.getByRole("button", { name: "14:40", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(participant.getByRole("button", { name: "15:05", exact: true })).toBeDisabled();
  await participant.getByRole("button", { name: "14:25", exact: true }).click();
  await participant.getByRole("button", { name: "Messages", exact: true }).click();
  await expect(participant.locator("body")).not.toContainText("O-01");
  await page
    .getByLabel(/Actual facilitator notes/)
    .fill("SYNTHETIC DRY-RUN — NOT HUMAN TESTING");
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export facilitator record" }).click();
  const download = await downloading;
  const stream = await download.createReadStream();
  let raw = "";
  for await (const part of stream!) raw += part.toString();
  expect(JSON.parse(raw)).toMatchObject({
    role: "earth",
    condition: "A",
    notes: "SYNTHETIC DRY-RUN — NOT HUMAN TESTING",
    participant: "synthetic-dry-run",
  });
  expect(JSON.parse(raw).sessionId).toBe(new URL(participant.url()).searchParams.get("session"));
});
