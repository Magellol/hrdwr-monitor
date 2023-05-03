import { pipe, constVoid, identity } from "fp-ts/function";
import * as O from "fp-ts/es6/Option";

export const unsafeUnwrap = <A>(ma: O.Option<A>): A =>
  pipe(
    ma,
    O.getOrElseW(() => {
      throw new Error("Expected Some but got None");
    })
  );

export const forEach =
  <A>(fn: (a: A) => void) =>
  (fa: O.Option<A>): void =>
    pipe(fa, O.match(constVoid, fn));

export const pureIf =
  <A>(f: () => A) =>
  (bool: boolean): O.Option<A> =>
    pipe(bool, O.fromPredicate(identity), O.map(f));

export * from "fp-ts/Option";
