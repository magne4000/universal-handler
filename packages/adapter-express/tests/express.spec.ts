import { type Run, runTests } from "@universal-middleware/tests";
import * as vitest from "vitest";

let port = 3100;

const runs: Run[] = [
  {
    name: "adapter-express: node",
    command: "pnpm run test:run-express:node",
    port: port++,
  },
  {
    name: "adapter-express: bun",
    command: "pnpm run test:run-express:bun",
    port: port++,
  },
  {
    name: "adapter-express: deno",
    command: "pnpm run test:run-express:deno",
    port: port++,
  },
];

runTests(runs, {
  vitest,
  test(response) {
    // added by helmet
    vitest.expect(response.headers.has("content-security-policy")).toBe(true);
    vitest.expect(response.headers.has("x-xss-protection")).toBe(true);
  },
});
