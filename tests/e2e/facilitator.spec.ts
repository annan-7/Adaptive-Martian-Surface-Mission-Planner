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
  });
});
