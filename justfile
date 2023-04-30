# Enhance `$PATH` with npm binaries. Prioritises npm binaries - `$PATH` is checked from the head -
# as GitHub's CI environment includes many conflicting binaries such as tsc.
export PATH := './node_modules/.bin:' + env_var('PATH')

# Compile a tsc project, handling cleanup between runs.
[private]
tsc project:
    @tsc -p ./{{ project }}/tsconfig.json

dev is_demo="true":
  rm -rf ./dist
  just tsc webpack
  DEMO={{ is_demo }} webpack serve -c ./dist/webpack/client.config.js

[private]
build is_demo:
  rm -rf ./dist
  just tsc webpack
  cp -r public/* dist/
  DEMO={{ is_demo }} NODE_ENV=production webpack -c ./dist/webpack/client.config.js

unit paths:
  NODE_ENV=development jest {{ paths }}

fmt-write:
  nixpkgs-fmt ./flake.nix
  rustfmt --edition 2021 ./app/**/*.rs

deploy-demo: (build "true")
  netlify deploy --prod -d dist/