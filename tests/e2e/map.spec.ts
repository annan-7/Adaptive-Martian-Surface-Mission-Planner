import { test, expect } from "@playwright/test";
test("authentic Mars raster and overlays render", async ({ page }) => {
  const errors: string[] = [];
  const failedAssets: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", response => {
    if (response.status() >= 400 && /\/data\/|maplibre-gl-worker/.test(response.url())) failedAssets.push(response.url());
  });
  await page.goto("/");
  await expect(page.getByTestId("science-map")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 30000 },
  );
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.getByRole("checkbox", { name: /THEMIS/ })).toBeEnabled();
  const canvas = page.locator("canvas");
  const before = (await canvas.screenshot()).toString("base64");
  await page.getByRole("checkbox", { name: /THEMIS/ }).uncheck();
  await expect.poll(async () => (await canvas.screenshot()).toString("base64")).not.toBe(before);
  await page.getByRole("checkbox", { name: /THEMIS/ }).check();
  await page.getByRole("checkbox", { name: /USGS fan/ }).uncheck();
  await page.getByRole("checkbox", { name: /USGS fan/ }).check();
  await page.getByRole("button", { name: "Reset map extent" }).click();
  await page.getByRole("button", { name: "Explore S2 · Flooding" }).click();
  await expect(page.getByRole("heading", { name: "Later energetic flooding", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Layer provenance and uncertainty" }).click();
  await expect(page.getByRole("heading", { name: "Source register" })).toBeVisible();
  await page.screenshot({
    path: "test-results/mars-map-proof.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
  expect(failedAssets).toEqual([]);
});
test("missing metadata has an honest fallback while scenario controls work", async ({ page }) => {
  await page.route("**/data/map-metadata.json", route => route.fulfill({ status: 404, body: "Missing" }));
  await page.goto("/");
  await expect(page.getByText(/Mars map metadata unavailable or invalid/)).toBeVisible();
  await expect(page.getByTestId("science-map")).toHaveAttribute("data-ready", "false");
  await expect(page.getByRole("checkbox", { name: /THEMIS/ })).toBeDisabled();
  await page.getByRole("button", { name: "Inspect S2 evidence" }).click();
  await expect(page.getByRole("heading", { name: "Later energetic flooding", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "14:25", exact: true }).click();
  await page.getByRole("button", { name: "Options", exact: true }).click();
  await expect(page.getByText("-10 min", { exact: true })).toBeVisible();
});
test("missing worker never advertises a successfully loaded map", async ({ page }) => {
  await page.route("**/assets/maplibre-gl-worker-*", route => route.abort());
  await page.goto("/");
  await expect(page.locator(".map-error")).toBeVisible({ timeout: 25000 });
  await expect(page.getByTestId("science-map")).toHaveAttribute("data-ready", "false");
});
