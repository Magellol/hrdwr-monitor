import * as ReactDOM from "react-dom/client";
import { mockInvoke } from "./mock";
import * as O from "./facades/Option";
import { pipe } from "fp-ts/function";
import { App } from "./App";

if (__DEMO__) {
  (window as any).invoke = mockInvoke;
}

const el = pipe(
  window.document.getElementById("app"),
  O.fromNullable,
  O.unsafeUnwrap
);

const app = ReactDOM.createRoot(el);
app.render(<App />);
