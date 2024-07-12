import { type Run, runTests } from "@universal-middleware/tests";
import * as vitest from "vitest";

const isWin = process.platform === "win32";
let port = 3000;

const runs: Run[] = [
  {
    name: "adapter-hono: node",
    command: "pnpm run test:run-hono:node",
    port: port++,
  },
  {
    name: "adapter-hono: bun",
    command: "pnpm run test:run-hono:bun",
    port: port++,
  },
];

if (!isWin) {
  // Deno tests are too slow on Windows
  runs.push({
    name: "adapter-hono: deno",
    command: "pnpm run test:run-hono:deno",
    port: port++,
  });
}

runTests(runs, {
  vitest,
  test(response) {
    // added by hono/secure-headers
    vitest
      .expect(response.headers.has("cross-origin-opener-policy"))
      .toBe(true);
    vitest.expect(response.headers.has("x-xss-protection")).toBe(true);
  },
});
