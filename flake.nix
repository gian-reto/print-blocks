{
  description = "Development environment for print-blocks";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};
        corepack = pkgs.stdenv.mkDerivation {
          name = "corepack";
          buildInputs = [pkgs.nodejs_24];
          phases = ["installPhase"];
          installPhase = ''
            mkdir -p $out/bin
            corepack enable --install-directory=$out/bin
          '';
        };
      in {
        devShells.default = pkgs.mkShell {
          packages = [corepack pkgs.nodejs_24];

          shellHook = ''
            export COREPACK_ENABLE_AUTO_PIN=0

            echo "node: $(node -v)"
            echo "corepack: $(corepack --version)"
            echo "pnpm: $(pnpm -v)"
          '';
        };
      }
    );
}
