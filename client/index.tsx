import * as ReactDOM from "react-dom/client";
import * as O from "./facades/Option";
import { pipe } from "fp-ts/function";
import { App } from "./App";

const el = pipe(
  window.document.getElementById("app"),
  O.fromNullable,
  O.unsafeUnwrap
);

const app = ReactDOM.createRoot(el);
app.render(<App />);
