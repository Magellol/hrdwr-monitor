# Enhance `$PATH` with npm binaries. Prioritises npm binaries - `$PATH` is checked from the head -
# as GitHub's CI environment includes many conflicting binaries such as tsc.
export PATH := './node_modules/.bin:' + env_var('PATH')

# Compile a tsc project, handling cleanup between runs.
[private]
tsc project:
    tsc -p ./{{ project }}/tsconfig.json

dev:
  rm -rf ./dist
  just tsc webpack
  just tsc server
  webpack serve -c ./dist/webpack/client.config.js

unit paths:
  NODE_ENV=development jest {{ paths }}
