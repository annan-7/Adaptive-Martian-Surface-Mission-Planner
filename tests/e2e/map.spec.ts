import { test, expect } from "@playwright/test";
test("authentic Mars raster and overlays render", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByTestId("science-map")).toHaveAttribute(
    "data-ready",
    "true",
    { timeout: 30000 },
  );
  await expect(page.locator("canvas")).toBeVisible();
  await page.screenshot({
    path: "test-results/mars-map-proof.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
