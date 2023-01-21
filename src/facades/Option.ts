import { pipe } from "fp-ts/es6/function";
import * as O from "fp-ts/es6/Option";

export const unsafeUnwrap = <A>(ma: O.Option<A>): A =>
  pipe(
    ma,
    O.getOrElseW(() => {
      throw new Error("Expected Some but got None");
    })
  );

export * from "fp-ts/Option";
