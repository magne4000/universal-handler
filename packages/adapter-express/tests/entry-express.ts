import { createHandler, createMiddleware } from "../src/index.js";
import express from "express";
import mri from "mri";

const args = mri<{ port: string }>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).Deno?.args ?? globalThis.process.argv.slice(2),
);

const app = express();

app.use(
  createMiddleware((_request, context) => {
    context.something = {
      a: 1,
    };
  }),
);

app.use(
  createMiddleware((_request, _context) => {
    return async (response) => {
      response.headers.set("x-test-value", "universal-middleware");
      response.headers.delete("x-should-be-removed");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      return response;
    };
  }),
);

app.use(
  createMiddleware((_request, context) => {
    context.somethingElse = {
      b: 2,
    };
  }),
);

app.use(
  createHandler((_request, context) => {
    return new Response(JSON.stringify(context, null, 2), {
      headers: {
        "x-should-be-removed": "universal-middleware",
      },
    });
  }),
);

const port = args.port ? parseInt(args.port) : 3000;

app.listen(port, "localhost", () => {
  console.log(`Server listening on http://localhost:${port}`);
});
