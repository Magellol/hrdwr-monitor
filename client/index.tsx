import { mockIPC } from "@tauri-apps/api/mocks";
import { pipe } from "fp-ts/function";
import * as ReactDOM from "react-dom/client";
import { App } from "./App";
import * as O from "./facades/Option";
import { mockInvoke } from "./mock";

if (__DEMO__) {
  let count = 0;
  mockIPC((cmd) => {
    const p = mockInvoke(count)(cmd);
    count++;
    return p;
  });
}

const el = pipe(
  window.document.getElementById("app"),
  O.fromNullable,
  O.unsafeUnwrap
);

const app = ReactDOM.createRoot(el);
app.render(<App />);
