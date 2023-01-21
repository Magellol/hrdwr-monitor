let
  # A pinned recent revision of nixpkgs/unstable.
  pkgs = import (builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/0bbb65673c0ba31047c9ba6c4cd211556b534a4e.tar.gz";
    sha256 = "151rgnr2ip5i4fk7hllirk0gchwavgca6bk4cqk7agxr4j1pnqgf";
  }) {};

in
  pkgs.mkShell {
    buildInputs = with pkgs; [
      nodejs
      yarn
      just
    ];
  }