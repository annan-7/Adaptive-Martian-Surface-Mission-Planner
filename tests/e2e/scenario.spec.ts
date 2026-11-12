import { test, expect } from "@playwright/test";
for (const condition of ["A", "B", "C"]) {
  test(`Earth privacy across panels and export, condition ${condition}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`/?role=earth&condition=${condition}&variant=canonical`);
    await page.getByRole("button", { name: "14:25", exact: true }).click();
    for (const tab of ["Science", "Messages", "Options", "Advice", "Sources"]) {
      await page.getByRole("button", { name: tab, exact: true }).click();
      await expect(page.locator("body")).not.toContainText("loose terrain");
      await expect(page.locator("body")).not.toContainText("O-01");
      await expect(page.locator("body")).not.toContainText("R-02");
      await expect(page.locator('[title*="loose terrain"]')).toHaveCount(0);
    }
    await page.getByRole("button", { name: /20 min travel/ }).click();
    await expect(
      page.getByText("No local change observation available.", {
        exact: false,
      }),
    ).toBeVisible();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export session" }).click();
    const download = await downloadPromise;
    const stream = await download.createReadStream();
    let raw = "";
    for await (const part of stream!) raw += part.toString();
    expect(raw).not.toMatch(/loose terrain|O-01|R-02|answerKey|revisedTravel/);
    expect(JSON.parse(raw).travel).toBe(20);
    await page.getByRole("button", { name: "14:40", exact: true }).click();
    await page.getByRole("button", { name: "Messages", exact: true }).click();
    await expect(page.getByText(/Crew observes loose terrain/)).toBeVisible();
    await page.getByRole("button", { name: "14:45", exact: true }).click();
    await expect(page.getByText("R-02 · recommendation")).toBeVisible();
    await page.getByRole("button", { name: "14:25", exact: true }).click();
    await expect(page.locator("body")).not.toContainText("loose terrain");
    expect(errors).toEqual([]);
  });
}
test("Astronaut decision, delayed recommendation, real notes and science", async ({
  page,
}) => {
  await page.goto("/?role=mars&condition=C&variant=canonical");
  await page.getByRole("button", { name: "14:25", exact: true }).click();
  await page
    .getByRole("button", { name: "S2 · Flooding", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Later energetic flooding",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText("NASA-JEZERO-2021", { exact: false }).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Options", exact: true }).click();
  await expect(page.getByText("-20 min", { exact: true })).toBeVisible();
  await expect(page.getByText("+20 min", { exact: true })).toBeVisible();
  await expect(page.getByText("+45 min", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Advice", exact: true }).click();
  await expect(
    page.getByText("requires_review", { exact: true }).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "14:45", exact: true }).click();
  await expect(page.getByText("R-02 · Earth Planner")).toHaveCount(0);
  await page.getByRole("button", { name: "15:05", exact: true }).click();
  await expect(page.getByText("R-02 · Earth Planner")).toBeVisible();
  await page.getByRole("button", { name: "Notebook", exact: true }).click();
  await expect(page.getByLabel("Your explanation and confusion")).toHaveValue(
    "",
  );
  await page.getByRole("button", { name: "Start task timer" }).click();
  await page
    .getByLabel("Your explanation and confusion")
    .fill("SYNTHETIC DRY-RUN — NOT HUMAN TESTING");
  await page.getByRole("button", { name: "Save real entry" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Entry saved" }),
  ).toBeVisible();
});
test("primary budgets and presentation parity", async ({ page }) => {
  for (const condition of ["A", "B", "C"]) {
    await page.goto(`/?role=mars&condition=${condition}&variant=primary`);
    await page.getByRole("button", { name: "14:25", exact: true }).click();
    await page.getByRole("button", { name: "Options", exact: true }).click();
    await expect(page.getByText("-10 min", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Local chronology" }),
    ).toHaveCount(condition === "A" ? 0 : 1);
    await expect(page.getByText("Changed assumption · inspect")).toHaveCount(
      condition === "C" ? 1 : 0,
    );
  }
});
test("mobile layout and keyboard controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "14:25", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "14:25", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
});
test("participant production server cannot serve facilitator keys", async ({
  request,
}) => {
  for (const path of [
    "/facilitator/key.json",
    "/key.json",
    "/docs/TEST_PROTOCOL.md",
  ]) {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
  }
});
