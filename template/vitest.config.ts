import { defineConfig } from "vitest/config";

// Separate from vite.config.ts on purpose: the reactRouter() plugin builds the
// whole app and doesn't run under Vitest. Tests render route components directly.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    include: ["app/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
