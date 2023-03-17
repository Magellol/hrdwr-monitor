with import <nixpkgs> {};

let
  # A pinned recent revision of nixpkgs/unstable.
  # TODO: I've copied this from unsplash and I'm not sure if I actually need this??
  pkgs = import (builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/0bbb65673c0ba31047c9ba6c4cd211556b534a4e.tar.gz";
    sha256 = "151rgnr2ip5i4fk7hllirk0gchwavgca6bk4cqk7agxr4j1pnqgf";
  }) {};

in
  let
    pythonEnv = python39.withPackages (ps: [
      ps.psutil
    ]);
in
  pkgs.mkShell {
    buildInputs = with pkgs; [
      nodejs
      yarn
      just
      pythonEnv
    ];
  }