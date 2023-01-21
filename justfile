# Enhance `$PATH` with npm binaries. Prioritises npm binaries - `$PATH` is checked from the head -
# as GitHub's CI environment includes many conflicting binaries such as tsc.
export PATH := './node_modules/.bin:' + env_var('PATH')

# Compile a tsc project, handling cleanup between runs.
@_tsc project:
    tsc -p ./{{ project }}/tsconfig.json

build:
  rm -rf ./dist
  just _tsc webpack
  just _tsc server
  webpack -c ./dist/webpack/client.config.js