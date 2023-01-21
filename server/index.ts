import Express from "express";
import { resolve } from "path";
import fs from "fs/promises";
import * as H from "hyper-ts";
import * as M from "hyper-ts/lib/Middleware";
import { toRequestHandler } from "hyper-ts/lib/express";
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

const readFile: (path: string) => TE.TaskEither<Error, string> = (path) =>
  TE.tryCatch(
    () => fs.readFile(path, { encoding: "utf8" }),
    () => new Error("Could not read file")
  );

const hello: M.Middleware<H.StatusOpen, H.ResponseEnded, Error, void> = pipe(
  readFile(resolve(__dirname, "..", "index.html")),
  M.fromTaskEither,
  M.ichainFirst(() => M.status(H.Status.OK)),
  M.ichainFirst(() => M.closeHeaders()),
  M.ichain((con) => M.send(con))
);

Express()
  .use("/a/", Express.static(resolve(__dirname, "..")))
  .get("/", toRequestHandler(hello))
  .listen(3000, () =>
    console.log("Express listening on port 3000. Use: GET /")
  );
