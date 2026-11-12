import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true,
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
      args: [
        "--enable-webgl",
        "--use-gl=angle",
        "--use-angle=swiftshader",
        "--enable-unsafe-swiftshader",
      ],
    },
  },
  webServer: [
    {
      command:
        "npm run build && python3 -m http.server 4173 --bind 127.0.0.1 --directory dist",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command:
        "python3 -m http.server 4174 --bind 127.0.0.1 --directory facilitator",
      url: "http://127.0.0.1:4174",
      reuseExistingServer: false,
    },
  ],
  workers: 1,
});
