import Express from "express";
import * as H from "hyper-ts";
import * as M from "hyper-ts/lib/Middleware";
import { toRequestHandler } from "hyper-ts/lib/express";
import { pipe } from "fp-ts/function";

const hello: M.Middleware<H.StatusOpen, H.ResponseEnded, never, void> = pipe(
  M.status(H.Status.OK), // writes the response status
  M.ichain(() => M.closeHeaders()), // tells hyper-ts that we're done with the headers
  M.ichain(() => M.send("Hello hyper-ts on express!")) // sends the response as text
);

Express()
  .use("/a/", Express.static(resolve(__dirname, "..")))
  .get("/", toRequestHandler(hello))
  .listen(3000, () =>
    console.log("Express listening on port 3000. Use: GET /")
  );
