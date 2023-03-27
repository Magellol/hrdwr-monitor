with import <nixpkgs> {};

let
  # A pinned recent revision of nixpkgs/unstable.
  pkgs = import (builtins.fetchTarball {
    url = "https://github.com/NixOS/nixpkgs/archive/dbf5322e93bcc6cfc52268367a8ad21c09d76fea.tar.gz";
    sha256 = "0lwk4v9dkvd28xpqch0b0jrac4xl9lwm6snrnzx8k5lby72kmkng";
  }) {};

in
  pkgs.mkShell {
    buildInputs = with pkgs; [
      nodejs
      yarn
      just
      rustup
    ];
  }